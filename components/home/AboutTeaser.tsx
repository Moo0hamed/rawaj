import Image from "next/image";
import { Check } from "lucide-react";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { siteConfig } from "@/content/site";

export function AboutTeaser({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="section bg-surface">
      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-[38px] bg-brand-100">
            <Image
              src="/images/about-team.jpg"
              alt={
                locale === "ar"
                  ? "فريق إبداعي يعمل على خطة تسويقية"
                  : "A creative team working on a marketing plan"
              }
              fill
              sizes="(max-width: 1024px) 90vw, 520px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-abyss/55 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-7 end-4 w-[236px] rounded-3xl border border-line bg-surface p-5 shadow-lift sm:end-8">
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-10 rounded-xl" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">
                  {dict.labels.since} {siteConfig.founded}
                </p>
                <p className="text-[14px] font-extrabold">
                  {locale === "ar" ? "شريك نمو حقيقي" : "A real growth partner"}
                </p>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div className="h-full w-[92%] rounded-full bg-brand-500" />
            </div>
            <p className="mt-2 text-[11.5px] font-semibold text-ink/45">
              {locale === "ar" ? "92% من العملاء يجدّدون" : "92% of clients renew"}
            </p>
          </div>

          <span className="absolute -start-3 -top-3 hidden h-20 w-20 rounded-full border border-dashed border-brand-300 lg:block" />
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">{dict.homeAbout.label}</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-display-sm">{dict.homeAbout.title}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 text-[16.5px] leading-[1.9] text-ink/60">{dict.homeAbout.body}</p>
          </Reveal>

          <ul className="mt-8 space-y-4">
            {dict.homeAbout.points.map((point, index) => (
              <Reveal key={point} delay={0.16 + index * 0.06} as="li">
                <div className="flex items-start gap-3.5">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-onAccent">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <p className="text-[15px] font-semibold leading-relaxed text-ink/75">{point}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.32} className="mt-9">
            <ButtonLink href={`/${locale}/team`} locale={locale} withArrow>
              {dict.homeAbout.cta}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
