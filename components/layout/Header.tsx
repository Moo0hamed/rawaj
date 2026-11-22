"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Globe } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Arrow } from "@/components/ui/Arrows";
import type { Locale } from "@/lib/i18n";
import type { NavItem } from "@/lib/nav";
import { cn, telHref } from "@/lib/utils";

type HeaderProps = {
  locale: Locale;
  nav: NavItem[];
  cta: string;
  switchLabel: string;
  otherLocale: Locale;
  phone: string;
  note: string;
};

export function Header({ locale, nav, cta, switchLabel, otherLocale, phone, note }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href;
    return pathname.startsWith(href);
  };

  const switchHref = (() => {
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = otherLocale;
    return `/${segments.join("/")}`;
  })();

  return (
    <>
      <div className="relative z-40 hidden bg-[#040B14] text-white md:block border-b-4 border-[#1A2D45]">
        <div className="shell flex h-10 items-center justify-between text-[12.5px]">
          <p className="flex items-center gap-2 text-white/80 font-semibold">
            <span className="inline-block h-2 w-2 bg-[#FFF83F]" aria-hidden="true" />
            {note}
          </p>
          <a href={telHref(phone)} className="flex items-center gap-2 font-bold text-[#7CC6FF] hover:text-[#FFF83F]" dir="ltr">
            <Phone className="h-3.5 w-3.5" />
            {phone}
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b-4 transition-none",
          scrolled ? "border-[#2391FF] bg-[#050D1A] py-2" : "border-[#1A2D45] bg-[#050D1A] py-3",
        )}
      >
        <div className="shell flex items-center justify-between gap-4">
          <Logo locale={locale} />

          <nav className="hidden min-w-0 items-center gap-1 lg:flex" aria-label="Main">
            {nav.filter((item) => item.key !== "home").map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "whitespace-nowrap border-2 px-2.5 py-1.5 text-[13px] font-bold",
                  isActive(item.href)
                    ? "border-[#FFF83F] bg-[#0A1626] text-[#FFF83F]"
                    : "border-transparent text-ink/70 hover:border-[#2391FF] hover:text-ink",
                  item.key === "play" && !isActive(item.href) && "text-[#FFF83F]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={switchHref}
              className="hidden border-2 border-[#1A2D45] bg-[#0A1626] px-3 py-2 text-[13px] font-bold text-ink/80 hover:border-[#2391FF] sm:inline-flex"
              hrefLang={otherLocale}
            >
              {switchLabel}
            </Link>
            <Link href={`/${locale}/contact`} className="btn-accent hidden !px-4 !py-2 text-[13px] md:inline-flex">
              {cta}
              <Arrow locale={locale} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center border-4 border-[#2391FF] bg-[#0A1626] text-ink lg:hidden"
              style={{ boxShadow: "3px 3px 0 0 #040B14" }}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[60] bg-[#03080F] lg:hidden">
          <div className="shell flex h-full flex-col py-5">
            <div className="flex items-center justify-between">
              <Logo locale={locale} tone="light" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center border-4 border-[#2391FF] bg-[#0A1626] text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-2" aria-label="Mobile">
              {nav.map((item, index) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between border-4 px-4 py-3 text-xl font-extrabold",
                    isActive(item.href) ? "border-[#FFF83F] bg-[#0A1626] text-[#FFF83F]" : "border-[#1A2D45] bg-[#050D1A] text-white",
                  )}
                >
                  {item.label}
                  <span className="font-pixel text-[10px] text-[#7CC6FF]">0{index + 1}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto space-y-3 pt-6">
              <Link href={switchHref} className="flex items-center justify-between border-4 border-[#1A2D45] bg-[#0A1626] px-4 py-3 text-sm font-bold text-white">
                {switchLabel}
                <Globe className="h-4 w-4 text-[#7CC6FF]" />
              </Link>
              <Link href={`/${locale}/contact`} className="btn-accent w-full !py-4 text-base">
                {cta}
                <Arrow locale={locale} />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}