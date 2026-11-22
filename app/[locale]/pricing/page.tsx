import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { FaqList } from "@/components/pricing/FaqList";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/content/dictionaries";
import { pricingNotes } from "@/content/pricing";
import { siteConfig } from "@/content/site";
import { isLocale, pick, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/utils";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.pricingSection.label,
    description: dict.pricingSection.body,
    alternates: {
      canonical: `/${locale}/pricing`,
      languages: { ar: "/ar/pricing", en: "/en/pricing" },
    },
  };
}

export default async function PricingPage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        label={dict.pricingSection.label}
        title={dict.pricingSection.title}
        body={dict.pricingSection.body}
        crumbs={[{ label: dict.nav.pricing }]}
      />

      <section className="section bg-surface">
        <div className="shell">
          <PricingPlans locale={locale} dict={dict.pricingSection} />

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {pick(pricingNotes, locale).map((note) => (
              <Reveal key={note}>
                <div className="flex h-full items-start gap-3 rounded-3xl border border-line bg-paper p-5">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-300">
                    <Check className="h-3 w-3" strokeWidth={3.5} />
                  </span>
                  <p className="text-[13px] leading-relaxed text-ink/60">{note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <span className="eyebrow">{dict.pricingSection.faqLabel}</span>
            <h2 className="mt-5 text-display-sm">{dict.pricingSection.faqTitle}</h2>
            <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-ink/55">
              {dict.pricingSection.customBody}
            </p>
            <a
              href={whatsappHref(siteConfig.whatsapp, dict.pricingSection.customCta)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dark mt-6"
            >
              {dict.pricingSection.customCta}
            </a>
          </div>
          <FaqList locale={locale} />
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={dict.contactCta.title}
        body={dict.contactCta.body}
        primary={{ label: dict.contactCta.primary, href: `/${locale}/contact` }}
        secondary={{
          label: dict.contactCta.secondary,
          href: whatsappHref(siteConfig.whatsapp, pick(siteConfig.tagline, locale)),
        }}
      />
    </>
  );
}
