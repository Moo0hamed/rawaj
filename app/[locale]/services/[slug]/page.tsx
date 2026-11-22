import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrows";
import { ServiceIcon } from "@/components/ui/Icons";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/JsonLd";
import { getService, services } from "@/content/services";
import { projects } from "@/content/projects";
import { getDictionary } from "@/content/dictionaries";
import { siteConfig } from "@/content/site";
import { isLocale, locales, pick, type Locale } from "@/lib/i18n";
import { telHref } from "@/lib/utils";

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: pick(service.title, locale),
    description: pick(service.intro, locale),
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages: {
        ar: `/ar/services/${slug}`,
        en: `/en/services/${slug}`,
      },
    },
    openGraph: {
      title: `${pick(service.title, locale)} | ${siteConfig.name}`,
      description: pick(service.intro, locale),
      images: [{ url: service.image, width: 1600, height: 900, alt: pick(service.title, locale) }],
    },
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const service = getService(slug);
  if (!service) notFound();

  const title = pick(service.title, locale);
  const related = projects.slice(0, 2);
  const others = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        locale={locale}
        label={dict.servicesPage.label}
        title={title}
        body={pick(service.intro, locale)}
        crumbs={[
          { label: dict.nav.services, href: `/${locale}/services` },
          { label: title },
        ]}
      >
        <div className="flex flex-wrap gap-2">
          {pick(service.deliverables, locale).map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-surface/[0.06] px-3 py-1.5 text-[11.5px] font-semibold text-white/70"
            >
              <Check className="h-3 w-3 text-accent" />
              {item}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="section bg-surface">
        <div className="shell grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div>
            <Reveal className="relative aspect-[16/9] overflow-hidden rounded-[32px] bg-brand-100">
              <Image
                src={service.image}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 780px"
                className="object-cover"
              />
            </Reveal>

            <div className="mt-10 space-y-5">
              {pick(service.description, locale).map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 20)} delay={0.04 * index}>
                  <p className="text-[16px] leading-[1.95] text-ink/65">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="flex items-center gap-3 text-[22px] font-extrabold">
                <span className="icon-tile h-10 w-10 rounded-xl">
                  <ServiceIcon name={service.icon} className="h-5 w-5" />
                </span>
                {dict.servicesPage.features}
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pick(service.features, locale).map((feature, index) => (
                  <Reveal key={feature.title} delay={0.06 * index}>
                    <div className="h-full rounded-3xl border border-line bg-paper p-5">
                      <span className="text-[11px] font-black tracking-[0.16em] text-brand-500">
                        0{index + 1}
                      </span>
                      <h3 className="mt-3 text-[15.5px] font-extrabold">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/55">
                        {feature.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-4xl border border-line bg-paper p-7">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink/40">
                {dict.servicesPage.deliverables}
              </p>
              <ul className="mt-4 space-y-3">
                {pick(service.deliverables, locale).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] font-semibold text-ink/70">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-onAccent">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/contact`}
                className="btn-accent group mt-7 w-full !py-3.5 text-[14px]"
              >
                {dict.servicesPage.startWith}
                <Arrow
                  locale={locale}
                  className="transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                />
              </Link>

              <div className="mt-6 space-y-3 border-t border-line pt-5 text-[13px] text-ink/55">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2.5 transition hover:text-brand-300"
                  dir="ltr"
                >
                  <Mail className="h-4 w-4 text-brand-500" />
                  {siteConfig.email}
                </a>
                <a
                  href={telHref(siteConfig.phone)}
                  className="flex items-center gap-2.5 transition hover:text-brand-300"
                  dir="ltr"
                >
                  <Phone className="h-4 w-4 text-brand-500" />
                  {siteConfig.phone}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="shell">
          <h2 className="text-[24px] font-extrabold">{dict.servicesPage.relatedWork}</h2>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {related.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
            ))}
          </div>

          <div className="mt-14 rounded-4xl border border-line bg-surface p-7 sm:p-9">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <h2 className="text-[20px] font-extrabold">{dict.servicesPage.otherServices}</h2>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-300 hover:text-brand-300"
              >
                {dict.common.viewAll}
                <Arrow locale={locale} />
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${locale}/services/${item.slug}`}
                  className="group flex items-center gap-3 rounded-2xl border border-line p-4 transition hover:border-brand-400/40 hover:bg-brand-50/40"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper text-brand-300 transition group-hover:bg-surface">
                    <ServiceIcon name={item.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-[13.5px] font-bold leading-snug">
                    {pick(item.title, locale)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={dict.contactCta.title}
        body={dict.contactCta.body}
        primary={{ label: dict.contactCta.primary, href: `/${locale}/contact` }}
      />

      <ServiceJsonLd
        name={title}
        description={pick(service.intro, locale)}
        url={`${siteConfig.url}/${locale}/services/${service.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: dict.nav.home, url: `${siteConfig.url}/${locale}` },
          { name: dict.nav.services, url: `${siteConfig.url}/${locale}/services` },
          { name: title, url: `${siteConfig.url}/${locale}/services/${service.slug}` },
        ]}
      />
    </>
  );
}
