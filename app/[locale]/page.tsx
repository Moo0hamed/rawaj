import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignExperience } from "@/components/campaign/CampaignExperience";
import { siteConfig } from "@/content/site";
import { isLocale, pick, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  return {
    title:
      locale === "ar"
        ? "حملة رَواج — موقعك هو اللعبة"
        : "RAWAJ Campaign — the site is the game",
    description:
      locale === "ar"
        ? "العب حملة تسويق كاملة: هوية، استراتيجية، محتوى، إعلانات، وإطلاق — وكل خدمة من خدمات رَواج بتتفتح بعد ما تنفذها. بدون تسجيل، وكل التقدم محفوظ على جهازك."
        : "Play a full marketing campaign: identity, strategy, content, ads, and launch — each RAWAJ service unlocks after you execute it. No signup, all progress stays on your device.",
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en", "x-default": "/ar" },
    },
    openGraph: {
      title: `${siteConfig.name} — ${pick(siteConfig.tagline, locale)}`,
      description: pick(siteConfig.description, locale),
    },
  };
}

export default async function HomePage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return <CampaignExperience locale={locale} />;
}
