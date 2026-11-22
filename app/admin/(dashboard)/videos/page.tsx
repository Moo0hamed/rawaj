"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/browser";

type Video = {
  id?: string;
  url: string;
  platform?: string;
  title_ar?: string; title_en?: string;
  description_ar?: string; description_en?: string;
  thumbnail_url?: string;
  category?: string; orientation?: string; service_slug?: string;
  published?: boolean; visible?: boolean; sort_order?: number;
};

const CATEGORIES = ["Promo films","Reels and short-form edits","Long-form video","Motion graphics","AI-assisted projects"];

export default function AdminVideos() {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [bulk, setBulk] = useState("");
  const [draft, setDraft] = useState<Video>({ url: "", platform: "other", category: CATEGORIES[0], orientation: "horizontal", published: false, visible: true, title_ar: "", title_en: "", description_ar: "", description_en: "", thumbnail_url: "", service_slug: "" });
  const [preview, setPreview] = useState<any>(null);

  async function load() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from("replay_videos").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    setLoading(false);
    if (error) setMsg("خطأ تحميل: " + error.message); else setItems((data as any) || []);
  }
  useEffect(() => { load(); }, []);

  async function fetchMeta(url: string) {
    setPreview(null);
    if (!url) return;
    try {
      const res = await fetch("/api/admin/link-meta", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const j = await res.json();
      setPreview(j);
      setDraft(d => ({ ...d, platform: j.platform || d.platform, title_ar: d.title_ar || j.title || "", title_en: d.title_en || j.title || "", thumbnail_url: d.thumbnail_url || j.thumbnail || "", description_ar: d.description_ar || j.description || "" }));
    } catch { setMsg("تعذر جلب المعاينة (جرّب تعديل الحقول يدويًا)"); }
  }

  async function saveVideo(v: Video) {
    if (!supabase) return setMsg("Supabase غير مُعدّ");
    if (!v.url) return setMsg("الرابط مطلوب");
    setMsg(null);
    const payload = { ...v }; delete (payload as any).id;
    const q = v.id ? supabase.from("replay_videos").update(payload).eq("id", v.id) : supabase.from("replay_videos").insert(payload);
    const { error } = await q;
    if (error) setMsg("خطأ حفظ: " + error.message + " (تأكد من تطبيق RLS وإضافتك في public.admins)");
    else { setMsg("تم الحفظ"); setDraft({ url: "", platform: "other", category: CATEGORIES[0], orientation: "horizontal", published: false, visible: true, title_ar: "", title_en: "", description_ar: "", description_en: "", thumbnail_url: "", service_slug: "" }); setPreview(null); load(); }
  }

  async function addBulk() {
    const urls = bulk.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    if (!urls.length) return;
    for (const u of urls) {
      let meta: any = {};
      try { meta = await (await fetch("/api/admin/link-meta", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({url:u}) })).json(); } catch {}
      await saveVideo({ url: u, platform: meta.platform || "other", title_ar: meta.title||"", title_en: meta.title||"", thumbnail_url: meta.thumbnail||"", description_ar: meta.description||"", description_en: "", category: CATEGORIES[0], orientation: "horizontal", published: false, visible: true });
    }
    setBulk(""); setMsg(`تمت إضافة ${urls.length} رابط/روابط كمسودات (راجعها وانشرها).`);
  }

  async function remove(id?: string) {
    if (!id || !supabase) return;
    if (!confirm("تأكيد الحذف؟")) return;
    const { error } = await supabase.from("replay_videos").delete().eq("id", id);
    if (error) setMsg("خطأ حذف: " + error.message); else { setMsg("تم الحذف"); load(); }
  }

  if (!configured) return <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4">Supabase غير مُعدّ. أضف Project URL و anon key في .env.local ثم طبّق migration.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black">غرفة العرض — فيديوهات (من اللوحة فقط)</h1>
        <p className="mt-1 text-sm text-white/60">ألصق رابطًا أو عدة روابط (سطر لكل رابط). لا استيراد جماعي ولا ملفات فيديو داخل المشروع. المعاينة قبل الحفظ. النشر/المسودة والتحكم بالظهور.</p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4">
        <h2 className="font-extrabold">إضافة فيديو بلصق الرابط</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="block md:col-span-2"><span className="text-xs text-white/60">رابط الفيديو</span>
            <div className="mt-1 flex gap-2"><input value={draft.url} onChange={e=>setDraft({...draft,url:e.target.value})} placeholder="https://..." className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm" />
            <button type="button" onClick={()=>fetchMeta(draft.url)} className="shrink-0 rounded-lg border border-[#2391FF]/50 px-3 py-2 text-sm font-bold text-[#2391FF]">معاينة</button></div>
          </label>
          {preview && (
            <div className="md:col-span-2 flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
              {preview.thumbnail ? <img src={preview.thumbnail} alt="" className="h-20 w-32 rounded-lg object-cover" /> : <div className="h-20 w-32 rounded-lg bg-white/5" />}
              <div className="text-sm"><div className="font-bold">{preview.title || "(بدون عنوان)"}</div><div className="text-white/50">المنصة: {preview.platform || "-"}</div>{preview.description ? <div className="mt-1 line-clamp-2 text-xs text-white/40">{preview.description}</div> : null}</div>
            </div>
          )}
          <Field label="العنوان (عربي)"><input value={draft.title_ar||""} onChange={e=>setDraft({...draft,title_ar:e.target.value})} className="inp" /></Field>
          <Field label="العنوان (EN)"><input value={draft.title_en||""} onChange={e=>setDraft({...draft,title_en:e.target.value})} className="inp" /></Field>
          <Field label="الوصف (عربي)"><input value={draft.description_ar||""} onChange={e=>setDraft({...draft,description_ar:e.target.value})} className="inp" /></Field>
          <Field label="الوصف (EN)"><input value={draft.description_en||""} onChange={e=>setDraft({...draft,description_en:e.target.value})} className="inp" /></Field>
          <Field label="رابط الصورة المصغرة"><input value={draft.thumbnail_url||""} onChange={e=>setDraft({...draft,thumbnail_url:e.target.value})} className="inp" /></Field>
          <Field label="المنصة"><input value={draft.platform||""} onChange={e=>setDraft({...draft,platform:e.target.value})} className="inp" placeholder="youtube/vimeo/facebook/tiktok/instagram/drive/mp4/other" /></Field>
          <Field label="التصنيف"><select value={draft.category||""} onChange={e=>setDraft({...draft,category:e.target.value})} className="inp">{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></Field>
          <Field label="الاتجاه"><select value={draft.orientation||"horizontal"} onChange={e=>setDraft({...draft,orientation:e.target.value})} className="inp"><option value="horizontal">أفقي</option><option value="vertical">عمودي</option><option value="unknown">غير محدد</option></select></Field>
          <Field label="خدمة مرتبطة (slug)"><input value={draft.service_slug||""} onChange={e=>setDraft({...draft,service_slug:e.target.value})} className="inp" placeholder="branding, social-media..." /></Field>
          <div className="flex items-end gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!draft.published} onChange={e=>setDraft({...draft,published:e.target.checked})} /> نشر</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.visible!==false} onChange={e=>setDraft({...draft,visible:e.target.checked})} /> ظاهر</label></div>
        </div>
        <div className="mt-3 flex gap-2"><button onClick={()=>saveVideo(draft)} className="rounded-lg bg-[#2391FF] px-4 py-2 text-sm font-bold text-[#040B14]">حفظ (مسودة/نشر)</button></div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4">
        <h2 className="font-extrabold">لصق عدة روابط (كل رابط في سطر)</h2>
        <textarea value={bulk} onChange={e=>setBulk(e.target.value)} rows={5} className="inp mt-2 w-full" placeholder={"https://youtube.com/...\nhttps://vimeo.com/..."} />
        <button onClick={addBulk} className="mt-2 rounded-lg border border-[#2391FF]/50 px-4 py-2 text-sm font-bold text-[#2391FF]">إضافة الكل كمسودات + جلب معاينة</button>
      </section>

      {msg && <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">{msg}</div>}

      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4">
        <h2 className="font-extrabold">الفيديوهات ({items.length}) {loading && "..."}</h2>
        <div className="mt-3 space-y-3">
          {items.map(v => (
            <div key={v.id} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {v.thumbnail_url ? <img src={v.thumbnail_url} alt="" className="h-14 w-24 shrink-0 rounded object-cover" /> : <div className="h-14 w-24 shrink-0 rounded bg-white/5" />}
                <div className="min-w-0"><div className="truncate font-bold">{v.title_ar || v.title_en || v.url}</div><div className="truncate text-xs text-white/50">{v.platform} · {v.category} · {v.published?"منشور":"مسودة"} · {v.visible!==false?"ظاهر":"مخفي"}</div></div>
              </div>
              <div className="flex shrink-0 gap-2 text-xs">
                <button onClick={()=>saveVideo({...v, published: !v.published})} className="rounded-md border border-white/15 px-2 py-1">{v.published?"إلغاء نشر":"نشر"}</button>
                <button onClick={()=>saveVideo({...v, visible: v.visible===false})} className="rounded-md border border-white/15 px-2 py-1">{v.visible===false?"إظهار":"إخفاء"}</button>
                <button onClick={()=>remove(v.id)} className="rounded-md border border-red-400/40 px-2 py-1 text-red-300">حذف</button>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-sm text-white/40">لا توجد فيديوهات. الغرفة تبقى "قريباً" للزوار حتى تنشر فيديوهات من هنا.</p>}
        </div>
      </section>

      <style jsx>{`
        .inp { width: 100%; border-radius: 0.5rem; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); padding: 0.5rem 0.75rem; font-size: 0.875rem; outline: none; }
        .inp:focus { border-color: #2391FF; }
      `}</style>
    </div>
  );
}

function Field({label, children}:{label:string;children:React.ReactNode}){ return <label className="block"><span className="text-xs text-white/60">{label}</span><div className="mt-1">{children}</div></label>; }