import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { TeamGrid } from "@/components/team/TeamGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/content/dictionaries";
import { team } from "@/content/team";
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
    title: dict.teamPage.label,
    description: dict.teamPage.body,
    alternates: {
      canonical: `/${locale}/team`,
      languages: { ar: "/ar/team", en: "/en/team" },
    },
  };
}

export default async function TeamPage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        label={dict.teamPage.label}
        title={dict.teamPage.title}
        body={dict.teamPage.body}
        crumbs={[{ label: dict.nav.team }]}
      />

      <section className="section bg-surface">
        <div className="shell">
          <TeamGrid members={team} locale={locale} columns={3} showSlot />

          <Reveal className="mt-16">
            <div className="relative overflow-hidden rounded-[36px] border border-line bg-paper p-8 sm:p-12">
              <div className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl">
                  <h2 className="text-[26px] font-extrabold leading-snug">
                    {dict.teamPage.joinTitle}
                  </h2>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink/55">
                    {dict.teamPage.joinBody}
                  </p>
                </div>
                <a
                  href={whatsappHref(siteConfig.whatsapp, dict.teamPage.joinCta)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark shrink-0"
                >
                  {dict.teamPage.joinCta}
                </a>
              </div>
            </div>
          </Reveal>
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
