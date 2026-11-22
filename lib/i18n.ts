export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export function localeHref(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

export const localeLabels: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

export const htmlLang: Record<Locale, string> = {
  ar: "ar",
  en: "en",
};
