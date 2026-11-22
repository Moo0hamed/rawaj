import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { WorkFilter } from "@/components/work/WorkFilter";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.workPage.label,
    description: dict.workPage.body,
    alternates: {
      canonical: `/${locale}/work`,
      languages: { ar: "/ar/work", en: "/en/work" },
    },
  };
}

export default async function WorkPage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        label={dict.workPage.label}
        title={dict.workPage.title}
        body={dict.workPage.body}
        crumbs={[{ label: dict.nav.work }]}
      />

      <section className="section bg-surface">
        <div className="shell">
          <WorkFilter locale={locale} dict={dict} />
        </div>
      </section>


      <CtaBand
        locale={locale}
        title={dict.workPage.ctaTitle}
        body={dict.workPage.ctaBody}
        primary={{ label: dict.contactCta.primary, href: `/${locale}/contact` }}
      />
    </>
  );
}
