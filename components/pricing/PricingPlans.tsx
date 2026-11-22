"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { plans } from "@/content/pricing";
import { pick, type Locale } from "@/lib/i18n";
import { cn, formatNumber } from "@/lib/utils";
import { Arrow } from "@/components/ui/Arrows";
import type { Dictionary } from "@/content/dictionaries";

type Props = {
  locale: Locale;
  dict: Dictionary["pricingSection"];
};

export function PricingPlans({ locale, dict }: Props) {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-3">
        <div
          className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1.5 shadow-card"
          role="group"
          aria-label={`${dict.monthly} / ${dict.yearly}`}
        >
          <button
            type="button"
            onClick={() => setYearly(false)}
            aria-pressed={!yearly}
            className={cn(
              "rounded-full px-5 py-2.5 text-[13.5px] font-bold transition",
              !yearly ? "bg-abyss text-white" : "text-ink/50 hover:text-ink",
            )}
          >
            {dict.monthly}
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            aria-pressed={yearly}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-bold transition",
              yearly ? "bg-abyss text-white" : "text-ink/50 hover:text-ink",
            )}
          >
            {dict.yearly}
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-black text-onAccent">
              {dict.save}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const annual = Math.round((plan.monthlyPrice * 12 * 0.85) / 100) * 100;
          const price = yearly ? annual : plan.monthlyPrice;
          const highlighted = Boolean(plan.highlighted);

          return (
            <article
              key={plan.slug}
              className={cn(
                "relative flex flex-col rounded-4xl border p-8 transition duration-500 ease-smooth hover:-translate-y-1",
                highlighted
                  ? "border-ink bg-abyss text-white shadow-lift lg:scale-[1.02]"
                  : "border-line bg-surface text-ink hover:border-ink/20 hover:shadow-lift",
              )}
            >
              {highlighted && plan.badge ? (
                <span className="absolute -top-3.5 start-7 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-black text-onAccent">
                  <Sparkles className="h-3 w-3" />
                  {pick(plan.badge, locale)}
                </span>
              ) : null}

              <h3 className="text-[21px] font-extrabold">{pick(plan.name, locale)}</h3>
              <p
                className={cn(
                  "mt-2 min-h-[48px] text-[13.5px] leading-relaxed",
                  highlighted ? "text-white/55" : "text-ink/50",
                )}
              >
                {pick(plan.tagline, locale)}
              </p>

              <div className="mt-7 flex items-end gap-2">
                <span className="text-[clamp(2rem,4vw,2.6rem)] font-black leading-none tabular-nums">
                  {formatNumber(price, locale)}
                </span>
                <span
                  className={cn(
                    "pb-1 text-[13px] font-bold",
                    highlighted ? "text-white/45" : "text-ink/40",
                  )}
                >
                  {dict.currency}
                  {yearly ? dict.perYearShort : dict.perMonthShort}
                </span>
              </div>

              <div className={cn("my-7 h-px w-full", highlighted ? "bg-surface/10" : "bg-line")} />

              <p
                className={cn(
                  "text-[11.5px] font-bold uppercase tracking-[0.16em]",
                  highlighted ? "text-white/40" : "text-ink/40",
                )}
              >
                {dict.includes}
              </p>

              <ul className="mt-4 flex-1 space-y-3.5">
                {pick(plan.features, locale).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        highlighted ? "bg-accent text-onAccent" : "bg-brand-50 text-brand-300",
                      )}
                    >
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                    <span
                      className={cn(
                        "text-[13.5px] leading-relaxed",
                        highlighted ? "text-white/70" : "text-ink/65",
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.extra ? (
                <p
                  className={cn(
                    "mt-5 rounded-2xl p-3.5 text-[12px] leading-relaxed",
                    highlighted ? "bg-surface/[0.06] text-white/60" : "bg-paper text-ink/55",
                  )}
                >
                  {pick(plan.extra, locale)}
                </p>
              ) : null}

              <Link
                href={`/${locale}/contact`}
                className={cn(
                  "group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[14px] font-bold transition",
                  highlighted
                    ? "bg-accent text-onAccent hover:bg-accent-400"
                    : "bg-abyss text-white hover:bg-deep",
                )}
              >
                {dict.choose}
                <Arrow
                  locale={locale}
                  className="transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                />
              </Link>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-center text-[12px] text-ink/40">{dict.vatNote}</p>
    </div>
  );
}
