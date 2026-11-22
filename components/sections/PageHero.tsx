import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { Arrow } from "@/components/ui/Arrows";

type Crumb = { label: string; href?: string };

type Props = {
  locale: Locale;
  label: string;
  title: string;
  body?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
};

export function PageHero({ locale, label, title, body, crumbs, children }: Props) {
  return (
    <section className="relative overflow-hidden border-b-4 border-[#2391FF] bg-[#03080F] pb-14 pt-12 text-white md:pb-16 md:pt-16">
      <div className="shell relative">
        {crumbs ? (
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[12px] text-white/50">
            <Link href={`/${locale}`} className="border-b-2 border-transparent hover:border-[#FFF83F] hover:text-[#FFF83F]">
              {locale === "ar" ? "الرئيسية" : "Home"}
            </Link>
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                <Arrow locale={locale} className="h-3 w-3 text-[#2391FF]" />
                {crumb.href ? (
                  <Link href={crumb.href} className="border-b-2 border-transparent hover:border-[#FFF83F] hover:text-[#FFF83F]">{crumb.label}</Link>
                ) : (
                  <span className="text-white/80">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        <div className="max-w-3xl border-4 border-[#1A2D45] bg-[#0A1626] p-5 sm:p-7" style={{ boxShadow: "6px 6px 0 0 #040B14, inset 2px 2px 0 0 #14243a" }}>
          <span className="eyebrow">{label}</span>
          <h1 className="font-display mt-4 text-display-md text-white" style={{ textShadow: "3px 3px 0 #040b14" }}>{title}</h1>
          {body ? <p className="mt-4 max-w-2xl text-[16px] leading-[1.8] text-white/75">{body}</p> : null}
        </div>

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}