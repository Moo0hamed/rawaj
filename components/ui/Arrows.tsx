import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Arrow({ locale, className }: { locale: Locale; className?: string }) {
  const Icon = locale === "ar" ? ArrowLeft : ArrowRight;
  return <Icon className={cn("h-4 w-4", className)} aria-hidden="true" />;
}

export function ExternalArrow({ className }: { className?: string }) {
  return <ArrowUpRight className={cn("h-4 w-4", className)} aria-hidden="true" />;
}
