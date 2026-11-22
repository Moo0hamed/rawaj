"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { pick, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Arrow } from "@/components/ui/Arrows";

type Props = {
  locale: Locale;
  label: string;
  title: string;
  body: string;
};

export function TestimonialsSlider({ locale, label, title, body }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const total = testimonials.length;
  const active = testimonials[index];

  const go = useCallback(
    (dir: 1 | -1) => setIndex((current) => (current + dir + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused || reduce || total === 0) return;
    const timer = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(timer);
  }, [paused, reduce, go, total]);

  if (total === 0 || !active) return null;

  return (
    <section
      className="section bg-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
        <div>
          <span className="eyebrow">{label}</span>
          <h2 className="mt-5 text-display-sm">{title}</h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink/55">{body}</p>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(locale === "ar" ? 1 : -1)}
              aria-label={locale === "ar" ? "السابق" : "Previous"}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/12 bg-surface text-ink transition hover:border-ink hover:bg-abyss hover:text-white"
            >
              <Arrow locale={locale === "ar" ? "en" : "ar"} className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(locale === "ar" ? -1 : 1)}
              aria-label={locale === "ar" ? "التالي" : "Next"}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/12 bg-surface text-ink transition hover:border-ink hover:bg-abyss hover:text-white"
            >
              <Arrow locale={locale} className="h-4 w-4" />
            </button>
            <span className="ms-2 text-[13px] font-bold tabular-nums text-ink/40">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -end-3 -top-5 hidden text-accent-700/20 sm:block">
            <Quote className="h-16 w-16" strokeWidth={1.5} />
          </div>

          <div className="relative min-h-[330px] overflow-hidden rounded-4xl border border-line bg-surface p-8 shadow-card sm:p-11">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-brand-300 to-accent" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={active.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex gap-1" aria-label={`${active.rating}/5`}>
                  {Array.from({ length: active.rating }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-accent-600 text-accent-600"
                    />
                  ))}
                </div>

                <blockquote className="mt-6 text-[19px] font-semibold leading-[1.75] text-ink/85 sm:text-[22px]">
                  “{pick(active.quote, locale)}”
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-3.5 border-t border-line pt-6">
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 items-center justify-center rounded-full bg-abyss text-[12px] font-black text-accent",
                    )}
                  >
                    {active.initials}
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-extrabold">
                      {pick(active.name, locale)}
                    </span>
                    <span className="block text-[12.5px] text-ink/50">
                      {pick(active.role, locale)}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex justify-center gap-1.5">
            {testimonials.map((item, dotIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(dotIndex)}
                aria-label={`${locale === "ar" ? "رأي" : "Review"} ${dotIndex + 1}`}
                aria-current={dotIndex === index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  dotIndex === index ? "w-8 bg-abyss" : "w-3 bg-abyss/15 hover:bg-abyss/30",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
