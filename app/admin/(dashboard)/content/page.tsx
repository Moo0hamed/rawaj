"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/browser";

type Item = { id?: string; kind: string; slug?: string; sort_order?: number; published?: boolean; visible?: boolean; data: any };

const KINDS = ["service","project","team","offer","pricing","faq","testimonial","industry","process","value","game","question","prank","event","achievement","text"];

export default function AdminContent() {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(()=>createClient(),[]);
  const [items,setItems]=useState<Item[]>([]); const [kind,setKind]=useState("service"); const [msg,setMsg]=useState<string|null>(null);
  const [draft,setDraft]=useState<Item>({kind:"service", slug:"", sort_order:0, published:true, visible:true, data:{}});
  const [jsonText,setJsonText]=useState("{}");

  async function load(){ if(!supabase) return; const {data,error}=await supabase.from("content_items").select("*").order("kind").order("sort_order",{ascending:true}); if(error) setMsg(error.message); else setItems((data as any)||[]); }
  useEffect(()=>{ load(); },[]);

  function edit(it: Item){ setDraft(it); setKind(it.kind); setJsonText(JSON.stringify(it.data||{}, null, 2)); }
  async function save(){
    if(!supabase) return; let dataObj:any = {};
    try{ dataObj = JSON.parse(jsonText||"{}"); }catch{ return setMsg("JSON غير صالح"); }
    const payload = { ...draft, kind, data: dataObj }; delete (payload as any).id;
    const q = draft.id ? supabase.from("content_items").update(payload).eq("id", draft.id) : supabase.from("content_items").insert(payload);
    const {error}=await q; if(error) setMsg("خطأ: "+error.message+" (RLS/admins)"); else { setMsg("تم الحفظ"); setDraft({kind, slug:"", sort_order:0, published:true, visible:true, data:{}}); setJsonText("{}"); load(); }
  }
  async function remove(id?: string){ if(!id||!supabase) return; if(!confirm("تأكيد الحذف؟")) return; const {error}=await supabase.from("content_items").delete().eq("id",id); if(error) setMsg(error.message); else {setMsg("تم الحذف"); load();} }

  if(!configured) return <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4">Supabase غير مُعدّ.</div>;

  const filtered = items.filter(i=>i.kind===kind);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black">إدارة المحتوى</h1>
        <p className="mt-1 text-sm text-white/60">عناصر منظمة (خدمات/أعمال/فريق/عروض/أسئلة/ألعاب/أحداث/نصوص...). تحرير JSON مرن الآن؛ يدعم نشر/مسودة، إظهار/إخفاء، ترتيب. المحتوى في الملفات يعمل كاحتياطي حتى يكتمل النقل للقاعدة.</p>
      </div>
      <div className="flex flex-wrap gap-2">{KINDS.map(k=> <button key={k} onClick={()=>setKind(k)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${kind===k?"bg-[#2391FF] text-[#040B14]":"border border-white/15 text-white/70"}`}>{k}</button>)}</div>
      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4 space-y-3">
        <h2 className="font-extrabold">إضافة/تعديل ({kind})</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block"><span className="text-xs text-white/60">slug</span><input value={draft.slug||""} onChange={e=>setDraft({...draft,slug:e.target.value})} className="inp mt-1" /></label>
          <label className="block"><span className="text-xs text-white/60">ترتيب</span><input type="number" value={draft.sort_order||0} onChange={e=>setDraft({...draft,sort_order:Number(e.target.value)})} className="inp mt-1" /></label>
          <div className="flex items-end gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.published!==false} onChange={e=>setDraft({...draft,published:e.target.checked})}/> نشر</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.visible!==false} onChange={e=>setDraft({...draft,visible:e.target.checked})}/> ظاهر</label></div>
        </div>
        <label className="block"><span className="text-xs text-white/60">البيانات (JSON)</span><textarea value={jsonText} onChange={e=>setJsonText(e.target.value)} rows={14} className="inp mt-1 font-mono text-xs" /></label>
        <div className="flex gap-2"><button onClick={save} className="rounded-lg bg-[#2391FF] px-4 py-2 text-sm font-bold text-[#040B14]">حفظ</button><button onClick={()=>{setDraft({kind,slug:"",sort_order:0,published:true,visible:true,data:{}}); setJsonText("{}");}} className="rounded-lg border border-white/15 px-4 py-2 text-sm">جديد</button></div>
      </section>
      {msg && <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">{msg}</div>}
      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4">
        <h2 className="font-extrabold">عناصر {kind} ({filtered.length})</h2>
        <div className="mt-3 space-y-2">{filtered.map(it=>(
          <div key={it.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
            <div className="min-w-0"><div className="font-bold truncate">{it.slug || it.id}</div><div className="text-xs text-white/50">order {it.sort_order} · {it.published?"منشور":"مسودة"} · {it.visible!==false?"ظاهر":"مخفي"}</div></div>
            <div className="flex gap-2 text-xs"><button onClick={()=>edit(it)} className="rounded-md border border-white/15 px-2 py-1">تعديل</button><button onClick={()=>remove(it.id)} className="rounded-md border border-red-400/40 px-2 py-1 text-red-300">حذف</button></div>
          </div>
        ))}{!filtered.length && <p className="text-sm text-white/40">لا عناصر.</p>}</div>
      </section>
      <style jsx>{`.inp{width:100%;border-radius:.5rem;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.3);padding:.5rem .75rem;font-size:.875rem;outline:none}.inp:focus{border-color:#2391FF}`}</style>
    </div>
  );
}