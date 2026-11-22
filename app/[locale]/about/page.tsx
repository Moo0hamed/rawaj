import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { StatsBand } from "@/components/home/StatsBand";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider";
import { TeamPreview } from "@/components/home/TeamPreview";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/content/dictionaries";
import { values } from "@/content/industries";
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
    title: dict.nav.about,
    description: dict.aboutPage.body,
    alternates: {
      canonical: `/${locale}/about`,
      languages: { ar: "/ar/about", en: "/en/about" },
    },
  };
}

export default async function AboutPage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        label={dict.aboutPage.label}
        title={dict.aboutPage.title}
        body={dict.aboutPage.body}
        crumbs={[{ label: dict.nav.about }]}
      />

      <section className="section bg-surface">
        <div className="shell grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-brand-100">
              <Image
                src="/images/about-office.jpg"
                alt={locale === "ar" ? "مكتب رَواج" : "The RAWAJ studio"}
                fill
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 start-6 rounded-3xl bg-accent px-6 py-5 text-onAccent shadow-accent">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
                {dict.labels.since}
              </p>
              <p className="text-3xl font-black leading-none">{siteConfig.founded}</p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="eyebrow">{dict.aboutPage.storyLabel}</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 text-display-sm">{dict.aboutPage.storyTitle}</h2>
            </Reveal>
            <div className="mt-7 space-y-5">
              {dict.aboutPage.story.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 24)} delay={0.1 + index * 0.06}>
                  <p className="text-[16px] leading-[1.95] text-ink/60">{paragraph}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3} className="mt-9">
              <ButtonLink href={`/${locale}/team`} locale={locale} withArrow>
                {dict.aboutPage.teamCta}
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="shell">
          <Reveal>
            <span className="eyebrow">{dict.aboutPage.valuesLabel}</span>
            <h2 className="mt-5 max-w-2xl text-display-sm">{dict.aboutPage.valuesTitle}</h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal key={value.title.en} delay={index * 0.06}>
                <div className="h-full rounded-3xl border border-line bg-surface p-7 transition hover:border-brand-400/40 hover:shadow-card">
                  <span className="text-[12px] font-black tracking-[0.18em] text-brand-500">
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 text-[17.5px] font-extrabold">{pick(value.title, locale)}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-[1.8] text-ink/55">
                    {pick(value.body, locale)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <StatsBand locale={locale} />
      <TeamPreview locale={locale} />
      <TestimonialsSlider
        locale={locale}
        label={dict.testimonialsSection.label}
        title={dict.testimonialsSection.title}
        body={dict.testimonialsSection.body}
      />

      <CtaBand
        locale={locale}
        title={dict.aboutPage.ctaTitle}
        body={dict.aboutPage.ctaBody}
        primary={{ label: dict.contactCta.primary, href: `/${locale}/contact` }}
        secondary={{
          label: dict.contactCta.secondary,
          href: whatsappHref(siteConfig.whatsapp, pick(siteConfig.tagline, locale)),
        }}
      />
    </>
  );
}
