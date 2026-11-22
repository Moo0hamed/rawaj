import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Alexandria, Baloo_Bhaijaan_2, Handjet, IBM_Plex_Sans_Arabic, Lalezar, Pixelify_Sans, Reem_Kufi } from "next/font/google";
import "../globals.css";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { GameProvider } from "@/components/game/GameProvider";
import { CampaignHUD } from "@/components/campaign/CampaignHUD";
import { Mascot } from "@/components/campaign/Mascot";
import { IntroScreen } from "@/components/game/IntroScreen";
import { ThemeShell } from "@/components/theme/ThemeShell";
import { getDictionary } from "@/content/dictionaries";
import { siteConfig } from "@/content/site";
import { getNav } from "@/lib/nav";
import { getDirection, isLocale, locales, pick, type Locale } from "@/lib/i18n";

const handjet = Handjet({
  subsets: ["arabic", "latin"],
  variable: "--font-px-ar",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const pixelify = Pixelify_Sans({ subsets:["latin"], variable:"--font-px-en", display:"swap", weight:["400","600","700"] });
const lalezar = Lalezar({ subsets:["arabic","latin"], variable:"--font-lalezar", display:"swap", weight:"400" });
const baloo = Baloo_Bhaijaan_2({ subsets:["arabic","latin"], variable:"--font-baloo", display:"swap", weight:["400","600","700","800"] });
const alex = Alexandria({ subsets:["arabic","latin"], variable:"--font-alex", display:"swap", weight:["400","600","700","800","900"] });
const ibm = IBM_Plex_Sans_Arabic({ subsets:["arabic","latin"], variable:"--font-ibm", display:"swap", weight:["400","500","600","700"] });
const reem = Reem_Kufi({ subsets:["arabic","latin"], variable:"--font-reem", display:"swap", weight:["400","600","700"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const title = `${siteConfig.name} — ${pick(siteConfig.tagline, locale)}`;
  const description = pick(siteConfig.description, locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords:
      locale === "ar"
        ? ["تسويق رقمي", "وكالة تسويق", "إدارة سوشيال ميديا", "تصوير ومونتاج", "هوية بصرية", "رَواج", "حملات إعلانية"]
        : ["digital marketing agency", "social media management", "brand identity", "photo and video production", "ad campaigns", "RAWAJ"],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
        "x-default": "/ar",
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
      url: `/${locale}`,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${pick(siteConfig.tagline, locale)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    other: {
      "format-detection": "telephone=no",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#040B14",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const nav = getNav(locale, dict);
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";

  return (
    <html lang={locale} dir={getDirection(locale)} className={`${handjet.variable} ${pixelify.variable} ${lalezar.variable} ${baloo.variable} ${alex.variable} ${ibm.variable} ${reem.variable}`}>
      <body className={locale === "ar" ? "min-h-screen pb-20 font-ar" : "min-h-screen pb-20 font-sans"}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-onAccent focus:shadow-px"
        >
          {locale === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content"}
        </a>
        <GameProvider>
          <ThemeShell>
            <Header
              locale={locale}
              nav={nav}
              cta={dict.nav.cta}
              switchLabel={dict.meta.switchTo}
              otherLocale={otherLocale}
              phone={siteConfig.phone}
              note={dict.common.consult}
            />
            <main id="main">{children}</main>
            <Footer locale={locale} />
            <CampaignHUD locale={locale} />
            <IntroScreen locale={locale} />
            <Mascot locale={locale} />
          </ThemeShell>
        </GameProvider>
        <OrganizationJsonLd locale={locale} />
      </body>
    </html>
  );
}