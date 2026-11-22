import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { robots: { index: false, follow: false } };

async function signOut() {
  "use server";
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } } as any;
  const user = data?.user;
  let isOwner = false;
  if (supabase && user) {
    const { data: rpcAdmin } = await supabase.rpc("is_admin");
    const { data: adminRow } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    isOwner = rpcAdmin === true || Boolean(adminRow);
  }

  if (supabase && user && !isOwner) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#03080F] px-4 text-[#E9F1FF]">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0A1626] p-6">
          <h1 className="text-lg font-black">صلاحية غير كافية</h1>
          <p className="mt-2 text-sm text-white/60">هذا الحساب ليس مالك الموقع. صلاحيات الكتابة/الإدارة للمالك فقط (RLS).</p>
          <p className="mt-2 text-xs text-white/40" dir="ltr">{user.email}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/setup" className="rounded-lg bg-[#2391FF] px-4 py-2 text-sm font-bold text-[#040B14]">إعداد المالك (لمرة واحدة)</Link>
            <form action={signOut}><button className="rounded-lg border border-white/15 px-4 py-2 text-sm font-bold">تسجيل خروج</button></form>
          </div>
        </div>
      </div>
    );
  }

  const nav = [
    { href: "/admin", label: "الرئيسية" },
    { href: "/admin/videos", label: "غرفة العرض (فيديوهات)" },
    { href: "/admin/channels", label: "غرفة الحسابات" },
    { href: "/admin/content", label: "المحتوى" },
    { href: "/admin/settings", label: "الإعدادات" },
  ];
  return (
    <div className="min-h-screen bg-[#03080F] text-[#E9F1FF]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050D1A]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-[#2391FF]">RAWAJ</span>
            <span className="rounded-full bg-[#FFF83F]/15 px-2 py-0.5 text-[10px] font-bold text-[#FFF83F]">ADMIN · noindex</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {user ? <span className="hidden text-white/50 sm:inline" dir="ltr">{user.email}</span> : <span className="text-yellow-300">Supabase غير مُعدّ</span>}
            <form action={signOut}><button className="rounded-md border border-white/15 px-2.5 py-1.5 font-semibold hover:border-[#2391FF]">تسجيل خروج</button></form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white/70 hover:bg-white/5 hover:text-white">
              {n.label}
            </Link>
          ))}
          <a href="/ar" target="_blank" rel="noreferrer" className="whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-semibold text-[#2391FF] hover:bg-white/5">معاينة الموقع ↗</a>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}