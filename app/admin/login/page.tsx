"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/browser";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase غير مُعدّ. ضع NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY في .env.local (anon فقط، بدون service_role).");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message || "فشل تسجيل الدخول");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    window.location.href = params.get("next") || "/admin";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#03080F] px-4 text-[#E9F1FF]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0A1626] p-6 shadow-xl">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#2391FF]">RAWAJ ADMIN</p>
        <h1 className="mt-1 text-xl font-black">لوحة تحكم رَواج</h1>
        <p className="mt-1 text-sm text-white/60">تسجيل دخول المالك (Supabase Auth). /admin noindex.</p>
        {!configured && (
          <div className="mt-4 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-3 text-sm text-yellow-100">
            مطلوب إعداد: ضع <b>Project URL</b> و<b>anon/publishable key</b> فقط في <code>.env.local</code> (NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY). لا تضع service_role أو أي مفتاح سري.
          </div>
        )}
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <label className="block">
            <span className="text-xs text-white/60">البريد الإلكتروني</span>
            <input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#2391FF]" />
          </label>
          <label className="block">
            <span className="text-xs text-white/60">كلمة المرور</span>
            <input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#2391FF]" />
          </label>
          {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 p-2 text-sm text-red-200">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-[#2391FF] px-4 py-2.5 text-sm font-bold text-[#040B14] disabled:opacity-40">
            {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
        <p className="mt-4 text-[11px] leading-relaxed text-white/40">
          أنشئ حساب المالك في Supabase Auth، ثم أضف <code>user_id</code> في جدول <code>public.admins</code> لتفعيل صلاحيات الكتابة (RLS). حماية المحاولات المتكررة/انتهاء الجلسة عبر Supabase Auth.
        </p>
      </div>
    </div>
  );
}