"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/content/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";

export default function LocaleNotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "ar";
  const locale: Locale = isLocale(segment) ? segment : "ar";
  const dict = getDictionary(locale);

  return (
    <section className="relative overflow-hidden bg-abyss py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-grid opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 start-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[130px]" />

      <div className="shell relative text-center">
        <p className="text-[clamp(6rem,18vw,12rem)] font-black leading-none text-accent">
          404
        </p>
        <span className="eyebrow eyebrow-dark mt-4">{dict.notFound.label}</span>
        <h1 className="mx-auto mt-5 max-w-2xl text-display-sm text-white">
          {dict.notFound.title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/55">
          {dict.notFound.body}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/${locale}`} className="btn-accent">
            {dict.notFound.homeCta}
          </Link>
          <Link href={`/${locale}/work`} className="btn-ghost-dark">
            {dict.notFound.workCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
