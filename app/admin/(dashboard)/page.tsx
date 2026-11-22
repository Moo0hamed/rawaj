import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHome() {
  const supabase = await createClient();
  let counts = { videos: 0, channels: 0, items: 0, configured: Boolean(supabase) };
  if (supabase) {
    const [v, c, i] = await Promise.all([
      supabase.from("replay_videos").select("id", { count: "exact", head: true }),
      supabase.from("channels").select("id", { count: "exact", head: true }),
      supabase.from("content_items").select("id", { count: "exact", head: true }),
    ]);
    counts.videos = v.count || 0; counts.channels = c.count || 0; counts.items = i.count || 0;
  }
  const cards = [
    { href: "/admin/videos", title: "غرفة العرض (Replay)", desc: "إضافة فيديوهات بلصق الروابط (YouTube/Vimeo/Facebook/TikTok/Instagram/Drive/mp4). لا استيراد جماعي ولا ملفات داخل المشروع.", stat: `${counts.videos} فيديو` },
    { href: "/admin/channels", title: "غرفة الحسابات", desc: "إدارة القنوات/الصفحات، جلب بيانات عامة وتخزين مؤقت (حسب التوفر/الصلاحيات).", stat: `${counts.channels} قناة` },
    { href: "/admin/content", title: "المحتوى", desc: "الخدمات، الأعمال، الفريق، العروض، النصوص، الألعاب/الأحداث… (نشر/مسودة، ترتيب، إخفاء).", stat: `${counts.items} عنصر` },
    { href: "/admin/settings", title: "الإعدادات والهوية", desc: "بيانات التواصل، الهوية، وضع الصيانة، إيقاف الرعب/المقالب، تصدير/استيراد JSON.", stat: "عام" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-black">لوحة التحكم</h1>
      <p className="mt-1 text-sm text-white/60">Supabase (Postgres/Auth/Storage/RLS). المحتوى من القاعدة مع احتياطي محلي. كتابة المالك فقط.</p>
      {!counts.configured && (
        <div className="mt-4 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-100">
          <b>إعداد مطلوب:</b> ضع <code>NEXT_PUBLIC_SUPABASE_URL</code> (Project URL) و<code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (publishable/anon) في <code>.env.local</code> فقط. لا تضع service_role أو أي مفتاح سري. ثم طبّق <code>supabase/migrations/001_init.sql</code> في Supabase SQL Editor وأنشئ حساب المالك وأضفه إلى <code>public.admins</code>.
        </div>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map(c => (
          <Link key={c.href} href={c.href} className="rounded-2xl border border-white/10 bg-[#0A1626] p-5 transition hover:border-[#2391FF]/50">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-base font-extrabold text-white">{c.title}</h2>
              <span className="rounded-full bg-[#2391FF]/15 px-2 py-0.5 text-[11px] font-bold text-[#2391FF]">{c.stat}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{c.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0A1626] p-5">
        <h3 className="font-extrabold">ترتيب التنفيذ (v2)</h3>
        <ol className="mt-2 list-decimal space-y-1 ps-5 text-sm text-white/60">
          <li>✅ (a-c) تحقق وQA</li>
          <li>⏳ Supabase + /admin + جداول + RLS + نقل المحتوى (أساس مُجهّز: migrations/عملاء/لوحة؛ التطبيق والنقل يتطلب إعداد المشروع)</li>
          <li>⏳ غرفة العرض من اللوحة</li>
          <li>⏳ غرفة الحسابات + الجلب والتخزين المؤقت</li>
          <li>⏳ MVP الشخصية المزدوجة</li>
          <li>⏳ النشر</li>
        </ol>
      </div>
    </div>
  );
}