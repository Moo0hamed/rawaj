import Link from "next/link";
import { Instagram, Facebook, Linkedin, Dribbble, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "./NewsletterForm";
import { siteConfig } from "@/content/site";
import { services } from "@/content/services";
import { getDictionary } from "@/content/dictionaries";
import { getNav } from "@/lib/nav";
import { pick, type Locale } from "@/lib/i18n";
import { telHref } from "@/lib/utils";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const nav = getNav(locale, dict);
  const year = new Date().getFullYear();

  const socials = [
    { href: siteConfig.social.instagram, label: "Instagram", Icon: Instagram },
    { href: siteConfig.social.facebook, label: "Facebook", Icon: Facebook },
    { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: siteConfig.social.behance, label: "Behance", Icon: Dribbble },
  ];

  return (
    <footer className="relative overflow-hidden border-t-4 border-[#2391FF] bg-[#03080F] text-white">
      <div className="shell relative pt-14 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.7fr_0.9fr_1.1fr]">
          <div>
            <Logo locale={locale} tone="light" />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/70">{dict.footer.tagline}</p>
            <div className="mt-5 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center border-2 border-[#1A2D45] bg-[#0A1626] text-white/80 hover:border-[#FFF83F] hover:text-[#FFF83F]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-pixel text-[10px] font-bold uppercase tracking-[0.12em] text-[#7CC6FF]">{dict.footer.quickLinks}</h3>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              {nav.slice(0, 6).map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="text-white/75 hover:text-[#FFF83F]">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-pixel text-[10px] font-bold uppercase tracking-[0.12em] text-[#7CC6FF]">{dict.footer.servicesTitle}</h3>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              {services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link href={`/${locale}/services/${service.slug}`} className="text-white/75 hover:text-[#FFF83F]">{pick(service.title, locale)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-pixel text-[10px] font-bold uppercase tracking-[0.12em] text-[#7CC6FF]">{dict.footer.contactTitle}</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] text-white/75">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2.5 hover:text-[#FFF83F]" dir="ltr">
                  <Mail className="h-4 w-4 text-[#2391FF]" />{siteConfig.email}
                </a>
              </li>
              <li>
                <a href={telHref(siteConfig.phone)} className="flex items-center gap-2.5 hover:text-[#FFF83F]" dir="ltr">
                  <Phone className="h-4 w-4 text-[#2391FF]" />{siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2391FF]" />{pick(siteConfig.address, locale)}
              </li>
            </ul>

            <div className="mt-6 border-4 border-[#1A2D45] bg-[#0A1626] p-4" style={{ boxShadow: "4px 4px 0 0 #040B14" }}>
              <h3 className="text-[15px] font-extrabold">{dict.footer.newsletterTitle}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-white/60">{dict.footer.newsletterBody}</p>
              <NewsletterForm
                placeholder={dict.footer.newsletterPlaceholder}
                button={dict.footer.subscribe}
                success={dict.footer.subscribed}
                error={dict.footer.newsletterError}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t-4 border-[#1A2D45] py-6 text-[13px] text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {year} {siteConfig.legalName}. {dict.footer.rights}.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>{dict.footer.madeBy}</span>
            <span className="text-white/30">·</span>
            <span className="font-display">{siteConfig.name}</span>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden px-4 pb-4">
        <div className="flex gap-1 opacity-20">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="h-3 w-3 shrink-0" style={{ background: i % 3 === 0 ? "#2391FF" : i % 3 === 1 ? "#FFF83F" : "#1A2D45" }} />
          ))}
        </div>
      </div>
    </footer>
  );
}