import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { Arrow } from "@/components/ui/Arrows";
import { cn } from "@/lib/utils";

type CtaProps = {
  locale: Locale;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  variant?: "dark" | "accent";
  className?: string;
};

export function CtaBand({
  locale,
  title,
  body,
  primary,
  secondary,
  variant = "dark",
  className,
}: CtaProps) {
  const isDark = variant === "dark";

  return (
    <section className={cn("section pt-0", className)}>
      <div className="shell">
        <div
          className={cn(
            "relative overflow-hidden rounded-[40px] px-7 py-14 sm:px-12 md:px-16 md:py-20",
            isDark ? "bg-abyss text-white" : "bg-accent text-onAccent",
          )}
        >
          {isDark ? (
            <>
              <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-grid opacity-40 [mask-image:radial-gradient(70%_70%_at_70%_30%,black,transparent)]" />
              <div className="pointer-events-none absolute -end-20 -top-24 h-80 w-80 rounded-full bg-brand-500/25 blur-[110px]" />
              <div className="pointer-events-none absolute -bottom-24 start-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[90px]" />
              <svg
                aria-hidden="true"
                viewBox="0 0 200 200"
                className="pointer-events-none absolute -bottom-10 end-8 hidden h-56 w-56 text-white/10 md:block"
              >
                <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeDasharray="4 8" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" />
                <circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" strokeDasharray="2 6" />
              </svg>
            </>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              className="pointer-events-none absolute -end-10 -top-16 h-64 w-64 text-ink/10"
            >
              <path
                d="M100 10l22 56 56 22-56 22-22 56-22-56-56-22 56-22 22-56Z"
                fill="currentColor"
              />
            </svg>
          )}

          <div className="relative grid gap-9 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h2 className="max-w-2xl text-display-sm">{title}</h2>
              <p
                className={cn(
                  "mt-5 max-w-xl text-[15.5px] leading-[1.85]",
                  isDark ? "text-white/60" : "text-ink/70",
                )}
              >
                {body}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Link
                href={primary.href}
                className={cn(
                  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-bold transition duration-300 hover:-translate-y-0.5",
                  isDark ? "bg-accent text-onAccent hover:bg-accent-400" : "bg-abyss text-white hover:bg-deep",
                )}
              >
                {primary.label}
                <Arrow
                  locale={locale}
                  className="transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                />
              </Link>
              {secondary ? (
                <a
                  href={secondary.href}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full border px-6 py-3.5 text-[14.5px] font-bold transition duration-300 hover:-translate-y-0.5",
                    isDark
                      ? "border-white/20 text-white hover:border-white/45 hover:bg-surface/10"
                      : "border-ink/25 text-ink hover:bg-abyss/5",
                  )}
                >
                  {secondary.label}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
