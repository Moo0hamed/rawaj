import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";

export type NavItem = { href: string; label: string; key: string };

export function getNav(locale: Locale, dict: Dictionary): NavItem[] {
  return [
    { key: "home", href: `/${locale}`, label: dict.nav.home },
    { key: "about", href: `/${locale}/about`, label: dict.nav.about },
    { key: "services", href: `/${locale}/services`, label: dict.nav.services },
    { key: "work", href: `/${locale}/work`, label: dict.nav.work },
    { key: "team", href: `/${locale}/team`, label: dict.nav.team },
    { key: "pricing", href: `/${locale}/pricing`, label: dict.nav.pricing },
    { key: "play", href: `/${locale}/campaign`, label: dict.nav.play },
    { key: "contact", href: `/${locale}/contact`, label: dict.nav.contact },
  ];
}
