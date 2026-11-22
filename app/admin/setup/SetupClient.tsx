"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/browser";

const OWNER_EMAIL = "123ONETWO123123@GMAIL.COM";

export default function AdminSetup() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const supabase = createClient();
  const [email, setEmail] = useState(OWNER_EMAIL);
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email ?? null);
        // if already owner, redirect
        const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
        if (admin) router.replace("/admin");
      }
    })();
  }, [supabase, router]);

  async function auth(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setMsg(null);
    if (!supabase) return setError("Supabase غير مُعدّ.");
    const normalized = email.trim().toLowerCase();
    if (normalized !== OWNER_EMAIL.toLowerCase()) {
      setError(`يجب استخدام بريد المالك المحدد: ${OWNER_EMAIL}`);
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email: normalized, password });
      setLoading(false);
      if (error) return setError(error.message);
      if (data.user && !data.session) {
        setMsg("تم إنشاء الحساب. خطوة واحدة مطلوبة: افتح بريدك واضغط رابط تأكيد Supabase، ثم ارجع هنا وسجّل دخولك واضغط \"أنا مالك الموقع\".");
        setMode("signin");
        return;
      }
      setUserEmail(data.user?.email ?? normalized);
      setMsg("تم تسجيل الدخول. اضغط \"أنا مالك الموقع\" لإتمام التفعيل (لمرة واحدة).");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalized, password });
      setLoading(false);
      if (error) return setError(error.message);
      setUserEmail(data.user?.email ?? normalized);
      setMsg("تم تسجيل الدخول. اضغط \"أنا مالك الموقع\" لإتمام التفعيل (لمرة واحدة).");
    }
  }

  async function claim() {
    setError(null); setMsg(null);
    if (!supabase) return setError("Supabase غير مُعدّ.");
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const u = userData.user;
    if (!u) { setLoading(false); return setError("سجّل الدخول أولاً."); }
    if ((u.email || "").toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
      setLoading(false);
      return setError(`الحساب الحالي (${u.email}) لا يطابق بريد المالك ${OWNER_EMAIL}. سجّل دخول بالبريد الصحيح.`);
    }
    const { data: existing } = await supabase.from("admins").select("user_id").limit(1);
    if (existing && existing.length > 0) {
      // check if me
      const mine = existing.find((a: any) => a.user_id === u.id);
      setLoading(false);
      if (mine) { router.replace("/admin"); return; }
      return setError("يوجد مالك بالفعل. لا يمكن تفعيل مالك آخر (claim_owner مرة واحدة).");
    }
    const { error } = await supabase.rpc("claim_owner");
    setLoading(false);
    if (error) {
      const m = error.message || "";
      if (m.includes("owner_already_exists")) return setError("يوجد مالك بالفعل. لا يمكن تفعيل مالك آخر.");
      if (m.includes("not_authenticated")) return setError("سجّل الدخول أولاً.");
      return setError("فشل التفعيل: " + m + " (تأكد من تطبيق migrations/دالة claim_owner).");
    }
    router.replace("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#03080F] px-4 text-[#E9F1FF]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0A1626] p-6 shadow-xl">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#2391FF]">RAWAJ SETUP</p>
        <h1 className="mt-1 text-xl font-black">إعداد المالك (لمرة واحدة)</h1>
        <p className="mt-1 text-sm text-white/60">أنشئ/سجّل دخول حساب المالك ثم اضغط “أنا مالك الموقع”. بعد النجاح لن تعمل هذه الصفحة كإعداد مرة أخرى.</p>
        {!configured && <div className="mt-4 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-3 text-sm text-yellow-100">Supabase غير مُعدّ (تحقق من .env.local).</div>}
        <form onSubmit={auth} className="mt-5 space-y-3">
          <div className="flex gap-2 text-xs">
            <button type="button" onClick={()=>setMode("signup")} className={`rounded-md px-3 py-1.5 font-bold ${mode==="signup"?"bg-[#2391FF] text-[#040B14]":"border border-white/15"}`}>إنشاء حساب</button>
            <button type="button" onClick={()=>setMode("signin")} className={`rounded-md px-3 py-1.5 font-bold ${mode==="signin"?"bg-[#2391FF] text-[#040B14]":"border border-white/15"}`}>تسجيل دخول</button>
          </div>
          <label className="block"><span className="text-xs text-white/60">بريد المالك</span>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#2391FF]" dir="ltr" />
            <span className="mt-1 block text-[11px] text-white/40">يجب أن يطابق: {OWNER_EMAIL}</span>
          </label>
          <label className="block"><span className="text-xs text-white/60">كلمة المرور</span>
            <input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#2391FF]" />
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-lg border border-[#2391FF]/50 px-4 py-2.5 text-sm font-bold text-[#2391FF] disabled:opacity-40">{loading?"..." : mode==="signup"?"إنشاء حساب / متابعة":"تسجيل الدخول"}</button>
        </form>
        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs text-white/60">الحالة: {userEmail ? <span dir="ltr" className="text-[#2391FF]">{userEmail}</span> : "غير مسجّل الدخول"}</div>
          <button onClick={claim} disabled={loading} className="mt-2 w-full rounded-lg bg-[#FFF83F] px-4 py-2.5 text-sm font-black text-[#040B14] disabled:opacity-40">أنا مالك الموقع (claim_owner لمرة واحدة)</button>
        </div>
        {msg && <p className="mt-3 rounded-lg border border-[#2391FF]/30 bg-[#2391FF]/10 p-2 text-sm text-[#bfe0ff]">{msg}</p>}
        {error && <p role="alert" className="mt-3 rounded-lg border border-red-400/30 bg-red-500/10 p-2 text-sm text-red-200">{error}</p>}
        <p className="mt-4 text-[11px] leading-relaxed text-white/40">الحماية: claim_owner آمنة (security definer) وتعمل فقط لمستخدم authenticated وعندما جدول admins فارغ، وتمنح صلاحية التنفيذ لـ authenticated فقط. RLS يمنع الكتابة لغير المالك.</p>
      </div>
    </div>
  );
}