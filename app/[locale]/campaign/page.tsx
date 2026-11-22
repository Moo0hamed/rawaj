import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignExperience } from "@/components/campaign/CampaignExperience";
import { isLocale, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  return {
    title: locale === "ar" ? "حملة رَواج" : "RAWAJ Campaign",
    description:
      locale === "ar"
        ? "رحلة تسويق تفاعلية من الهوية للإطلاق — العب وافهم خدمات رَواج بالممارسة."
        : "An interactive marketing journey from identity to launch — play and learn RAWAJ's services by doing.",
    alternates: {
      canonical: `/${locale}/campaign`,
      languages: { ar: "/ar/campaign", en: "/en/campaign" },
    },
  };
}

export default async function CampaignPage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  return <CampaignExperience locale={locale} />;
}
