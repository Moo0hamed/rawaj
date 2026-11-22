import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

type LogoProps = {
  locale: Locale;
  tone?: "dark" | "light";
  className?: string;
  href?: string;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center border-4 border-[#2391FF] bg-[#0A1626]",
        className,
      )}
      aria-hidden="true"
      style={{ boxShadow: "inset 2px 2px 0 0 #14243a, inset -2px -2px 0 0 #040b14, 4px 4px 0 0 #040b14" }}
    >
      {/* Animated pixel star rays behind (steps) */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span
          className="absolute h-[3px] w-8 bg-[#FFF83F] opacity-80 motion-safe:animate-[starPulse_1.2s_steps(2)_infinite]"
          style={{ boxShadow: "0 0 0 0 #FFF83F" }}
        />
        <span
          className="absolute h-8 w-[3px] bg-[#FFF83F] opacity-80 motion-safe:animate-[starPulse_1.2s_steps(2)_infinite_0.6s]"
        />
      </span>
      <svg viewBox="0 0 40 40" fill="none" className="relative z-10 h-8 w-8" shapeRendering="crispEdges">
        <path
          d="M20 5.5l4.2 10.3L34.5 20l-10.3 4.2L20 34.5l-4.2-10.3L5.5 20l10.3-4.2L20 5.5Z"
          fill="#FFF83F"
        />
        <rect x="18" y="18" width="4" height="4" fill="#040B14" />
      </svg>
    </span>
  );
}

export function Logo({ locale, tone = "dark", className, href }: LogoProps) {
  const isDark = tone === "dark";
  const content = (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[22px] font-black leading-none",
            isDark ? "text-ink" : "text-white",
          )}
          style={{ textShadow: "2px 2px 0 #040b14" }}
        >
          رَواج
        </span>
        <span
          className={cn(
            "mt-1 font-pixel text-[8px] font-bold uppercase tracking-[0.18em]",
            isDark ? "text-[#7CC6FF]" : "text-white/70",
          )}
        >
          RAWAJ
        </span>
      </span>
    </span>
  );

  return (
    <Link
      href={href ?? `/${locale}`}
      aria-label={locale === "ar" ? "رَواج — الصفحة الرئيسية" : "RAWAJ — Home"}
      className={cn("group inline-flex items-center", className)}
    >
      {content}
    </Link>
  );
}