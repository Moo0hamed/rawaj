"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import { adminErrorMessage } from "@/lib/admin/error-msg";

type Channel = {
  id?: string; url: string; platform?: string; name?: string; description?: string;
  avatar_url?: string; cover_url?: string; stats?: any; stats_source?: string; is_real_stats?: boolean;
  last_fetched_at?: string; fetch_status?: string; fetch_error?: string;
  linked_service_slug?: string; linked_stage?: string; sort_order?: number; published?: boolean; visible?: boolean;
  manual?: any;
};

export default function AdminChannels() {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Channel[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [draft, setDraft] = useState<Channel>({ url:"", platform:"", name:"", description:"", avatar_url:"", cover_url:"", published:false, visible:true, stats:{}, manual:{}, is_real_stats:false, stats_source:"none" });

  async function load(){ if(!supabase) return; const {data,error}=await supabase.from("channels").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false}); if(error) setMsg("خطأ: "+error.message); else setItems((data as any)||[]); }
  useEffect(()=>{ load(); },[]);

  async function previewMeta(){
    if(!draft.url) return;
    try{ const j=await (await fetch("/api/admin/link-meta",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:draft.url})})).json();
      setDraft(d=>({...d, platform: d.platform||j.platform||"", name: d.name||j.title||"", description: d.description||j.description||"", avatar_url: d.avatar_url||j.thumbnail||""}));
    }catch{ setMsg("تعذر جلب المعاينة"); }
  }

  async function save(c: Channel){
    if(!supabase) return setMsg("Supabase غير مُعدّ"); if(!c.url) return setMsg("الرابط مطلوب");
    setMsg(null);
    const payload={...c}; delete (payload as any).id;
    const q = c.id ? supabase.from("channels").update(payload).eq("id", c.id) : supabase.from("channels").insert(payload);
    try {
      const {error}=await q; if(error) return setMsg(adminErrorMessage(error).ar);
      setMsg("تم الحفظ"); setDraft({ url:"", platform:"", name:"", description:"", avatar_url:"", cover_url:"", published:false, visible:true, stats:{}, manual:{}, is_real_stats:false, stats_source:"none" }); load();
    } catch (e: any) { setMsg(adminErrorMessage(e).ar); }
  }
  async function remove(id?: string){ if(!id||!supabase) return; if(!confirm("تأكيد الحذف؟")) return; try { const {error}=await supabase.from("channels").delete().eq("id",id); if(error) return setMsg(adminErrorMessage(error).ar); setMsg("تم الحذف"); load(); } catch (e: any) { setMsg(adminErrorMessage(e).ar); } }

  if(!configured) return <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4">Supabase غير مُعدّ.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black">غرفة الحسابات (القنوات والصفحات)</h1>
        <p className="mt-1 text-sm text-white/60">ألصق رابط الصفحة. الجلب من السيرفر (OG/oEmbed متاح الآن؛ YouTube API/Meta Graph تتطلب مفاتيح/ربط رسمي وتُجهّز عبر Edge Functions لاحقًا). Cache/تحديث 24h يُفعّل بعد إعداد الوظائف المجدولة في Supabase. الأرقام غير المتاحة تُدخل يدويًا وتُميّز عن أرقام الحملة الافتراضية. ممنوع scraping/تجاوز حماية.</p>
      </div>
      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4 space-y-3">
        <h2 className="font-extrabold">إضافة/تعديل قناة</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block md:col-span-2"><span className="text-xs text-white/60">رابط الصفحة</span><div className="mt-1 flex gap-2"><input value={draft.url} onChange={e=>setDraft({...draft,url:e.target.value})} className="inp w-full" placeholder="https://..." /><button type="button" onClick={previewMeta} className="rounded-lg border border-[#2391FF]/50 px-3 text-sm font-bold text-[#2391FF]">معاينة</button></div></label>
          <L label="الاسم"><input value={draft.name||""} onChange={e=>setDraft({...draft,name:e.target.value})} className="inp" /></L>
          <L label="المنصة"><input value={draft.platform||""} onChange={e=>setDraft({...draft,platform:e.target.value})} className="inp" placeholder="youtube/facebook/instagram/tiktok/..." /></L>
          <L label="الوصف"><input value={draft.description||""} onChange={e=>setDraft({...draft,description:e.target.value})} className="inp" /></L>
          <L label="صورة/أفاتار URL"><input value={draft.avatar_url||""} onChange={e=>setDraft({...draft,avatar_url:e.target.value})} className="inp" /></L>
          <L label="غلاف URL"><input value={draft.cover_url||""} onChange={e=>setDraft({...draft,cover_url:e.target.value})} className="inp" /></L>
          <L label="ربط بخدمة (slug)"><input value={draft.linked_service_slug||""} onChange={e=>setDraft({...draft,linked_service_slug:e.target.value})} className="inp" /></L>
          <L label="ربط بمرحلة"><input value={draft.linked_stage||""} onChange={e=>setDraft({...draft,linked_stage:e.target.value})} className="inp" /></L>
          <L label="متابعين (يدوي)"><input value={(draft.stats as any)?.followers ?? ""} onChange={e=>setDraft({...draft,stats:{...(draft.stats||{}),followers:e.target.value}, stats_source: draft.stats_source||"manual"})} className="inp" /></L>
          <L label="مشاهدات (يدوي)"><input value={(draft.stats as any)?.views ?? ""} onChange={e=>setDraft({...draft,stats:{...(draft.stats||{}),views:e.target.value}, stats_source: draft.stats_source||"manual"})} className="inp" /></L>
          <L label="منشورات (يدوي)"><input value={(draft.stats as any)?.posts ?? ""} onChange={e=>setDraft({...draft,stats:{...(draft.stats||{}),posts:e.target.value}, stats_source: draft.stats_source||"manual"})} className="inp" /></L>
          <L label="مصدر الأرقام"><select value={draft.stats_source||"none"} onChange={e=>setDraft({...draft,stats_source:e.target.value, is_real_stats: e.target.value!=="none" && e.target.value!=="manual"})} className="inp"><option value="none">غير متاح</option><option value="manual">يدوي</option><option value="og_oembed">OG/oEmbed</option><option value="official_api">API رسمي</option></select></L>
          <div className="flex items-end gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!draft.published} onChange={e=>setDraft({...draft,published:e.target.checked})}/> نشر</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.visible!==false} onChange={e=>setDraft({...draft,visible:e.target.checked})}/> ظاهر</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!draft.is_real_stats} onChange={e=>setDraft({...draft,is_real_stats:e.target.checked})}/> أرقام حقيقية</label></div>
        </div>
        <div className="flex gap-2"><button onClick={()=>save(draft)} className="rounded-lg bg-[#2391FF] px-4 py-2 text-sm font-bold text-[#040B14]">حفظ</button></div>
      </section>
      {msg && <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">{msg}</div>}
      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4">
        <h2 className="font-extrabold">القنوات ({items.length})</h2>
        <div className="mt-3 space-y-3">
          {items.map(c=>(
            <div key={c.id} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0"><div className="truncate font-bold">{c.name || c.url}</div><div className="truncate text-xs text-white/50">{c.platform} · {c.stats_source||"none"} · {c.fetch_status||"—"} · {c.published?"منشور":"مسودة"}</div>{c.fetch_error ? <div className="text-xs text-red-300">{c.fetch_error}</div>:null}</div>
              <div className="flex shrink-0 gap-2 text-xs">
                <button onClick={()=>save({...c,published:!c.published})} className="rounded-md border border-white/15 px-2 py-1">{c.published?"إلغاء نشر":"نشر"}</button>
                <button onClick={()=>save({...c,visible:c.visible===false})} className="rounded-md border border-white/15 px-2 py-1">{c.visible===false?"إظهار":"إخفاء"}</button>
                <button onClick={()=>setDraft(c)} className="rounded-md border border-white/15 px-2 py-1">تعديل</button>
                <button onClick={()=>remove(c.id)} className="rounded-md border border-red-400/40 px-2 py-1 text-red-300">حذف</button>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-sm text-white/40">لا توجد قنوات بعد.</p>}
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4 text-sm text-white/60">
        <h3 className="font-extrabold text-white">ملاحظات الربط والتحديث (v2)</h3>
        <ul className="mt-2 list-disc space-y-1 ps-5">
          <li><b>YouTube Data API v3:</b> يدعم إحصاءات رسمية بمفتاح API (مجاني بحدود). يُضاف المفتاح كـ secret في Supabase Edge Function (ليس في الواجهة).</li>
          <li><b>Meta Graph API (Facebook/Instagram):</b> اختياري ومعطّل حتى الربط الرسمي بصلاحيات الصفحة. خطوات: إنشاء تطبيق Meta، إضافة المنتج المناسب، ربط الصفحات/الحساب المهني، الحصول على صلاحيات pages_read_engagement/instagram_basic، تخزين الرموز كـ secrets، الجلب عبر Edge Function.</li>
          <li><b>TikTok:</b> oEmbed عام فقط (بيانات محدودة)؛ أرقام رسمية تتطلب صلاحيات رسمية.</li>
          <li><b>Cache/تحديث تلقائي 24h + زر "حدّث الآن":</b> يُنفّذ عبر Supabase Edge Function + pg_cron/مجدول يخزن النتائج في الجدول؛ الزائر يقرأ من الـ cache فقط. عند الفشل تبقى آخر بيانات ناجحة.</li>
          <li>جميع الجلب من السيرفر، sanitization للنصوص/الروابط، وتخزين الصور في Storage بدلاً من التحميل المباشر من المنصة عند تفعيل خط الجلب.</li>
        </ul>
      </section>
      <style jsx>{`.inp{width:100%;border-radius:.5rem;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.3);padding:.5rem .75rem;font-size:.875rem;outline:none}.inp:focus{border-color:#2391FF}`}</style>
    </div>
  );
}
function L({label,children}:{label:string;children:React.ReactNode}){return <label className="block"><span className="text-xs text-white/60">{label}</span><div className="mt-1">{children}</div></label>}