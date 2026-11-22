import type { Locale } from "@/lib/i18n";
import { ar, type Dictionary } from "./ar";
import { en } from "./en";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
