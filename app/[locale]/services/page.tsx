import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrows";
import { ServiceIcon } from "@/components/ui/Icons";
import { services } from "@/content/services";
import { getDictionary } from "@/content/dictionaries";
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
    title: dict.servicesPage.label,
    description: dict.servicesPage.body,
    alternates: {
      canonical: `/${locale}/services`,
      languages: { ar: "/ar/services", en: "/en/services" },
    },
  };
}

export default async function ServicesPage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        label={dict.servicesPage.label}
        title={dict.servicesPage.title}
        body={dict.servicesPage.body}
        crumbs={[{ label: dict.nav.services }]}
      />

      <section className="section bg-surface">
        <div className="shell space-y-6">
          {services.map((service, index) => {
            const reversed = index % 2 === 1;
            return (
              <Reveal key={service.slug}>
                <article className="group grid overflow-hidden rounded-[36px] border border-line bg-paper lg:grid-cols-2">
                  <div
                    className={`relative min-h-[280px] overflow-hidden bg-brand-100 lg:min-h-[380px] ${
                      reversed ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={service.image}
                      alt={pick(service.title, locale)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition duration-[900ms] ease-smooth group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss/45 to-transparent lg:bg-gradient-to-r lg:from-abyss/30 lg:to-transparent" />
                    <span className="absolute start-5 top-5 inline-flex items-center gap-2 rounded-full bg-surface/90 px-3.5 py-1.5 text-[11.5px] font-black text-ink backdrop-blur">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                    <span className="icon-tile">
                      <ServiceIcon name={service.icon} className="h-6 w-6" />
                    </span>
                    <h2 className="mt-6 text-[26px] font-extrabold leading-snug md:text-[30px]">
                      {pick(service.title, locale)}
                    </h2>
                    <p className="mt-3 text-[15px] leading-[1.85] text-ink/55">
                      {pick(service.intro, locale)}
                    </p>

                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {pick(service.deliverables, locale).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[13.5px] text-ink/65">
                          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-300">
                            <Check className="h-2.5 w-2.5" strokeWidth={4} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/${locale}/services/${service.slug}`}
                      className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-abyss px-5 py-3 text-[13.5px] font-bold text-white transition hover:bg-brand-600"
                    >
                      {dict.servicesSection.servicePageCta}
                      <Arrow locale={locale} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <ProcessTimeline locale={locale} />

      <CtaBand
        locale={locale}
        title={dict.servicesPage.ctaTitle}
        body={dict.servicesPage.ctaBody}
        primary={{ label: dict.contactCta.primary, href: `/${locale}/contact` }}
        secondary={{
          label: dict.contactCta.secondary,
          href: whatsappHref(siteConfig.whatsapp, pick(siteConfig.tagline, locale)),
        }}
      />
    </>
  );
}
