"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { industries } from "@/content/industries";
import { pick, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { IndustryIcon } from "@/components/ui/Icons";
import { Arrow } from "@/components/ui/Arrows";

type Props = {
  locale: Locale;
  label: string;
  title: string;
  body: string;
  cta: string;
};

export function IndustriesTabs({ locale, label, title, body, cta }: Props) {
  const [active, setActive] = useState(industries[0].slug);
  const reduce = useReducedMotion();
  const current = industries.find((item) => item.slug === active) ?? industries[0];

  return (
    <section className="relative overflow-hidden bg-abyss py-20 text-white md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-grid opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 start-[10%] h-[420px] w-[420px] rounded-full bg-brand-500/20 blur-[130px]" />

      <div className="shell relative">
        <div className="max-w-2xl">
          <span className="eyebrow eyebrow-dark">{label}</span>
          <h2 className="mt-5 text-display-sm text-white">{title}</h2>
          <p className="mt-5 text-[16.5px] leading-relaxed text-white/60">{body}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
          <div
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            role="tablist"
            aria-label={label}
          >
            {industries.map((industry) => {
              const isActive = industry.slug === current.slug;
              return (
                <button
                  key={industry.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`industry-panel-${industry.slug}`}
                  id={`industry-tab-${industry.slug}`}
                  onClick={() => setActive(industry.slug)}
                  className={cn(
                    "group flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3.5 text-start transition duration-300 lg:w-full lg:justify-between",
                    isActive
                      ? "border-accent/30 bg-accent text-onAccent"
                      : "border-white/10 bg-surface/[0.03] text-white/65 hover:border-white/25 hover:text-white",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <IndustryIcon name={industry.icon} className="h-[18px] w-[18px]" />
                    <span className="text-[14.5px] font-bold">{pick(industry.name, locale)}</span>
                  </span>
                  <Arrow
                    locale={locale}
                    className={cn(
                      "hidden h-4 w-4 transition lg:block",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[330px] rounded-4xl border border-white/10 bg-surface/[0.04] p-7 backdrop-blur sm:p-9">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.slug}
                role="tabpanel"
                id={`industry-panel-${current.slug}`}
                aria-labelledby={`industry-tab-${current.slug}`}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-onAccent">
                    <IndustryIcon name={current.icon} className="h-5 w-5" />
                  </span>
                  <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/40">
                    {pick(current.name, locale)}
                  </p>
                </div>

                <p className="mt-6 max-w-2xl text-[17px] font-semibold leading-[1.85] text-white/85">
                  {pick(current.intro, locale)}
                </p>

                <ul className="mt-7 grid gap-3 sm:grid-cols-1">
                  {pick(current.moves, locale).map((move) => (
                    <li key={move} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-white/60">{move}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/${locale}/contact`}
                    className="group inline-flex items-center gap-2 rounded-full bg-surface px-5 py-3 text-[13.5px] font-bold text-ink transition hover:bg-accent hover:text-onAccent"
                  >
                    {cta}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                  <span className="text-[12px] text-white/35">
                    {locale === "ar" ? "خطة مخصصة لمجالك" : "A plan tailored to your field"}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
