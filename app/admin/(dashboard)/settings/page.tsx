"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import { adminErrorMessage } from "@/lib/admin/error-msg";

export default function AdminSettings() {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(()=>createClient(),[]);
  const [data,setData]=useState<any>({ identity:{ primary:"#2391FF", accent:"#FFF83F" }, contact:{ phone:"01024345291", email:"123ONETWO123123@GMAIL.COM", address:"شبين الكوم، المنوفية، مصر", whatsapp:"01024345291" }, toggles:{ maintenance:false, horrorEnabled:true, pranksEnabled:true }, texts:{} });
  const [msg,setMsg]=useState<string|null>(null);
  const [json,setJson]=useState("{}");

  async function load(){ if(!supabase) return; const {data,error}=await supabase.from("site_settings").select("data").eq("id",1).maybeSingle(); if(error) setMsg(error.message); else if(data?.data){ setData((d:any)=>({...d, ...(data.data as any)})); setJson(JSON.stringify(data.data||{},null,2)); } else { setJson(JSON.stringify(data,null,2)); } }
  useEffect(()=>{ load(); },[]);

  async function save(obj:any){
    if(!supabase) return;
    setMsg(null);
    try {
      const {error}=await supabase.from("site_settings").upsert({ id:1, data: obj });
      if(error) return setMsg(adminErrorMessage(error).ar);
      setMsg("تم الحفظ");
    } catch (e: any) { setMsg(adminErrorMessage(e).ar); }
  }

  async function saveJson(){ try{ const obj=JSON.parse(json); setData(obj); await save(obj);}catch{ setMsg("JSON غير صالح"); } }

  async function exportAll(){
    if(!supabase) return;
    const [s,v,c,i]=await Promise.all([
      supabase.from("site_settings").select("*"),
      supabase.from("replay_videos").select("*"),
      supabase.from("channels").select("*"),
      supabase.from("content_items").select("*"),
    ]);
    const blob = { exported_at: new Date().toISOString(), site_settings:s.data||[], replay_videos:v.data||[], channels:c.data||[], content_items:i.data||[] };
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify(blob,null,2)],{type:"application/json"})); a.download="rawaj-export.json"; a.click();
  }

  async function importAll(file: File){
    if(!supabase) return;
    try{
      const obj=JSON.parse(await file.text());
      if(obj.site_settings?.[0]?.data){ await supabase.from("site_settings").upsert({id:1,data:obj.site_settings[0].data}); }
      // Note: for safety, import does not auto-delete; it upserts where ids exist or inserts new rows for videos/channels/items if needed.
      if(Array.isArray(obj.replay_videos)) for(const r of obj.replay_videos){ const {id,...rest}=r; await supabase.from("replay_videos").upsert({id,...rest}); }
      if(Array.isArray(obj.channels)) for(const r of obj.channels){ const {id,...rest}=r; await supabase.from("channels").upsert({id,...rest}); }
      if(Array.isArray(obj.content_items)) for(const r of obj.content_items){ const {id,...rest}=r; await supabase.from("content_items").upsert({id,...rest}); }
      setMsg("تم الاستيراد (upsert). راجع البيانات."); load();
    }catch(e:any){ setMsg("فشل الاستيراد: "+(e?.message||e)); }
  }

  if(!configured) return <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4">Supabase غير مُعدّ.</div>;

  const t=(k:string,v:boolean)=> setData((d:any)=>{ const nd={...d,toggles:{...(d.toggles||{}),[k]:v}}; setJson(JSON.stringify(nd,null,2)); return nd; });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black">الإعدادات والهوية</h1>
        <p className="mt-1 text-sm text-white/60">بيانات التواصل، الهوية، إعدادات عامة (صيانة/إيقاف الرعب والمقالب)، نصوص رئيسية، تصدير/استيراد JSON. الحفظ في Supabase (site_settings).</p>
      </div>
      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4 space-y-3">
        <h2 className="font-extrabold">إعدادات عامة سريعة</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="flex items-center gap-2 rounded-xl border border-white/10 p-3"><input type="checkbox" checked={!!data?.toggles?.maintenance} onChange={e=>t("maintenance",e.target.checked)} /> وضع صيانة</label>
          <label className="flex items-center gap-2 rounded-xl border border-white/10 p-3"><input type="checkbox" checked={data?.toggles?.horrorEnabled!==false} onChange={e=>t("horrorEnabled",e.target.checked)} /> تفعيل الرعب/Glitch (عند توفره)</label>
          <label className="flex items-center gap-2 rounded-xl border border-white/10 p-3"><input type="checkbox" checked={data?.toggles?.pranksEnabled!==false} onChange={e=>t("pranksEnabled",e.target.checked)} /> تفعيل المقالب</label>
        </div>
        <button onClick={()=>save(data)} className="rounded-lg bg-[#2391FF] px-4 py-2 text-sm font-bold text-[#040B14]">حفظ الإعدادات السريعة</button>
      </section>
      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4 space-y-3">
        <h2 className="font-extrabold">الإعدادات الكاملة (JSON)</h2>
        <textarea value={json} onChange={e=>setJson(e.target.value)} rows={18} className="inp font-mono text-xs" />
        <button onClick={saveJson} className="rounded-lg bg-[#2391FF] px-4 py-2 text-sm font-bold text-[#040B14]">حفظ JSON</button>
      </section>
      <section className="rounded-2xl border border-white/10 bg-[#0A1626] p-4 space-y-3">
        <h2 className="font-extrabold">نسخة احتياطية</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportAll} className="rounded-lg border border-[#2391FF]/50 px-4 py-2 text-sm font-bold text-[#2391FF]">تصدير JSON</button>
          <label className="cursor-pointer rounded-lg border border-white/15 px-4 py-2 text-sm font-bold">استيراد JSON<input type="file" accept="application/json" className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f) importAll(f);}} /></label>
        </div>
        <p className="text-xs text-white/45">الاستيراد يقوم بـ upsert ولا يحذف تلقائيًا. تأكد قبل الحذف/الاستبدال.</p>
      </section>
      {msg && <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">{msg}</div>}
      <style jsx>{`.inp{width:100%;border-radius:.5rem;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.3);padding:.5rem .75rem;font-size:.875rem;outline:none}.inp:focus{border-color:#2391FF}`}</style>
    </div>
  );
}