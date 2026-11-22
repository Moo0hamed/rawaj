import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gamepad2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { PlayHub } from "@/components/game/play/PlayHub";
import { CtaBand } from "@/components/sections/CtaBand";
import { getDictionary } from "@/content/dictionaries";
import { siteConfig } from "@/content/site";
import { isLocale, pick, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/utils";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  return {
    title: locale === "ar" ? "استراحة اللعب — ألعاب ومقالب خفيفة" : "Playground — light games & pranks",
    description:
      locale === "ar"
        ? "10 ألعاب مصغّرة ومقالب خفيفة داخل موقع رَواج. اجمع نقاط XP وارتقِ المستويات — كل شيء يعمل على جهازك فقط."
        : "10 mini-games and light pranks inside the RAWAJ site. Collect XP and level up — everything runs on your device only.",
    alternates: {
      canonical: `/${locale}/play`,
      languages: { ar: "/ar/play", en: "/en/play" },
    },
  };
}

export default async function PlayPage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const notes =
    locale === "ar"
      ? [
          {
            title: "ألعاب صغيرة، شغل كبير",
            body: "المقالب والألعاب هنا للتسلية. الشغل الحقيقي — الاستراتيجية والمحتوى والحملات — موجود في باقي الموقع.",
          },
          {
            title: "بدون تسجيل أو بيانات",
            body: "نقاطك ومستوياتك محفوظة على جهازك فقط. لا نطلب بريدك، ولا نرسل أي شيء لأي خادم.",
          },
          {
            title: "آمنة للجميع",
            body: "كل مقلب مكتوب عليه أنه مقلب، وبدون أي محتوى مخيف أو عنيف. تقدر تخطي أي حاجة في أي وقت.",
          },
        ]
      : [
          {
            title: "Small games, serious work",
            body: "The pranks and games here are for fun. The real work — strategy, content, campaigns — lives across the site.",
          },
          {
            title: "No signup, no data",
            body: "Your XP and levels stay on your device. We don't ask for your email and never send anything to a server.",
          },
          {
            title: "Safe for everyone",
            body: "Every prank is clearly labeled, with no scary or violent content. Skip anything, anytime.",
          },
        ];

  return (
    <>
      <PageHero
        locale={locale}
        label={locale === "ar" ? "استراحة اللاعبين" : "Player lounge"}
        title={locale === "ar" ? "خد بريك… واجمع XP" : "Take a break… and collect XP"}
        body={
          locale === "ar"
            ? "10 ألعاب مصغّرة، 4 مقالب خفيفة، وطريقة ممتعة تتعرف بيها على طريقة تفكيرنا. كل حاجة على جهازك، وكل حاجة قابلة للتخطي."
            : "10 mini-games, 4 light pranks, and a fun way to see how we think. Everything runs on your device and everything is skippable."
        }
        crumbs={[{ label: locale === "ar" ? "اللعب" : "Play" }]}
      />

      <section className="section bg-surface">
        <div className="shell">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="hud-chip">
              <Gamepad2 className="h-3.5 w-3.5 text-brand-200" />
              {locale === "ar" ? "10 ألعاب" : "10 games"}
            </span>
            <span className="hud-chip">
              <Zap className="h-3.5 w-3.5 text-accent" />
              {locale === "ar" ? "حتى 380 XP" : "up to 380 XP"}
            </span>
            <span className="hud-chip">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-200" />
              {locale === "ar" ? "بدون تسجيل" : "No signup"}
            </span>
            <span className="hud-chip">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {locale === "ar" ? "محفوظ محليًا" : "Saved locally"}
            </span>
          </div>

          <PlayHub locale={locale} />
        </div>
      </section>

      <section className="section pt-0">
        <div className="shell">
          <div className="grid gap-4 md:grid-cols-3">
            {notes.map((note) => (
              <div key={note.title} className="rounded-2xl border border-line bg-white/[0.02] p-5">
                <h2 className="text-[14.5px] font-extrabold text-ink">{note.title}</h2>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink/50">{note.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={locale === "ar" ? "عجبتك اللعبة؟ الشغل الحقيقي أحلى." : "Enjoyed the game? The real work is better."}
        body={
          locale === "ar"
            ? "لو عايز تسويق بيشتغل فعلًا لعلامتك، اتكلم معانا — بدون مقالب في المكالمة الأولى."
            : "If you want marketing that actually works for your brand, talk to us — no pranks on the first call."
        }
        primary={{ label: dict.contactCta.primary, href: `/${locale}/contact` }}
        secondary={{
          label: dict.contactCta.secondary,
          href: whatsappHref(siteConfig.whatsapp, pick(siteConfig.tagline, locale)),
        }}
      />
    </>
  );
}
