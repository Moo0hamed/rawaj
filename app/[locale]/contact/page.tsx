import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Instagram, Facebook, Linkedin, Mail, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { ExternalArrow } from "@/components/ui/Arrows";
import { getDictionary } from "@/content/dictionaries";
import { siteConfig } from "@/content/site";
import { isLocale, pick, type Locale } from "@/lib/i18n";
import { telHref, whatsappHref } from "@/lib/utils";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.contactPage.label,
    description: dict.contactPage.body,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { ar: "/ar/contact", en: "/en/contact" },
    },
  };
}

export default async function ContactPage({ params }: Params) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const c = dict.contactPage;
  const socials = [
    { href: siteConfig.social.instagram, label: "Instagram", Icon: Instagram },
    { href: siteConfig.social.facebook, label: "Facebook", Icon: Facebook },
    { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[#07162D] py-20 text-white md:py-28">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: "radial-gradient(ellipse at 50% 10%,rgba(96,184,255,.28),transparent 26%),linear-gradient(180deg,#0B2245 0%,#07162D 45%,#040B14 100%)" }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-full w-[min(680px,100%)] opacity-40" aria-hidden="true" style={{ background: "conic-gradient(from 180deg at 50% 0%,transparent 35%,rgba(124,198,255,.18) 50%,transparent 65%)" }} />
        <div className="shell relative text-center">
          <p className="font-pixel text-[10px] tracking-[0.22em] text-[#7CC6FF]">GAME OVER?</p>
          <h1 className="mt-4 text-[clamp(48px,10vw,120px)] font-black leading-none text-white" style={{ fontFamily: "var(--font-handjet),sans-serif", textShadow: "0 0 24px rgba(96,184,255,.45)" }}>
            {locale === "ar" ? "ابدأ؟" : "START?"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70">{c.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={whatsappHref(siteConfig.whatsapp)} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-[#FFF83F] px-6 py-3 text-[13px] font-black text-[#FFF83F] shadow-[0_0_18px_rgba(255,248,63,.25)] transition hover:bg-[#FFF83F] hover:text-[#07162D]">{locale === "ar" ? "ابدأ واتساب" : "Start WhatsApp"}</a>
            <a href={telHref(siteConfig.phone)} className="rounded-full border-2 border-[#60B8FF] px-6 py-3 text-[13px] font-black text-[#60B8FF] shadow-[0_0_18px_rgba(96,184,255,.25)] transition hover:bg-[#60B8FF] hover:text-[#07162D]">{locale === "ar" ? "اتصال مباشر" : "Call now"}</a>
          </div>
        </div>
      </section>

      <section className="section bg-[#07162D]">
        <div className="shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <Reveal>
            <div className="rounded-[32px] border-2 border-[#60B8FF]/30 bg-[#0B2245]/70 p-6 shadow-[0_0_30px_rgba(35,145,255,.08)] sm:p-9">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-[24px] font-extrabold text-white">{c.formTitle}</h2>
                  <p className="mt-1.5 text-[13.5px] text-white/55">{c.formBody}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#FFF83F]/40 bg-[#FFF83F]/10 px-3.5 py-1.5 text-[11.5px] font-bold text-[#FFF83F]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFF83F]" />
                  {locale === "ar" ? "متاحون الآن" : "Available now"}
                </span>
              </div>
              <div className="mt-8"><ContactForm locale={locale} dict={c} /></div>
            </div>
          </Reveal>

          <div className="space-y-5">
            <Reveal delay={0.04}>
              <div className="grid grid-cols-3 gap-2.5">
                <a href={telHref(siteConfig.phone)} className="group flex flex-col items-center gap-2 rounded-2xl border border-[#60B8FF]/30 bg-[#0B2245] px-2 py-4 text-center text-white transition hover:border-[#60B8FF]"><Phone className="h-4 w-4 text-[#60B8FF]" /><span className="text-[11.5px] font-bold">{locale === "ar" ? "اتصال مباشر" : "Call now"}</span></a>
                <a href={whatsappHref(siteConfig.whatsapp)} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 rounded-2xl border border-[#FFF83F]/40 bg-[#FFF83F]/10 px-2 py-4 text-center text-[#FFF83F] transition hover:bg-[#FFF83F] hover:text-[#07162D]"><MessageCircle className="h-4 w-4" /><span className="text-[11.5px] font-black">{locale === "ar" ? "واتساب" : "WhatsApp"}</span></a>
                <a href={`mailto:${siteConfig.email}`} className="group flex flex-col items-center gap-2 rounded-2xl border border-[#60B8FF]/30 bg-[#0B2245] px-2 py-4 text-center text-white transition hover:border-[#60B8FF]"><Mail className="h-4 w-4 text-[#60B8FF]" /><span className="text-[11.5px] font-bold">{locale === "ar" ? "راسلنا" : "Email us"}</span></a>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-[32px] border border-[#60B8FF]/20 bg-[#040B14] p-7 text-white sm:p-8">
                <h2 className="text-[18px] font-extrabold">{c.infoTitle}</h2>
                <ul className="mt-6 space-y-5">
                  <li><a href={`mailto:${siteConfig.email}`} className="group flex items-start gap-3.5" dir="ltr"><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#60B8FF]/25 bg-[#0B2245] text-[#60B8FF]"><Mail className="h-4 w-4" /></span><span><span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">{c.emailLabel}</span><span className="mt-0.5 block text-[14.5px] font-semibold text-white/85">{siteConfig.email}</span></span></a></li>
                  <li><a href={telHref(siteConfig.phone)} className="group flex items-start gap-3.5" dir="ltr"><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#60B8FF]/25 bg-[#0B2245] text-[#60B8FF]"><Phone className="h-4 w-4" /></span><span><span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">{c.phoneLabel}</span><span className="mt-0.5 block text-[14.5px] font-semibold text-white/85">{siteConfig.phone}</span></span></a></li>
                  <li className="flex items-start gap-3.5"><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#60B8FF]/25 bg-[#0B2245] text-[#60B8FF]"><MapPin className="h-4 w-4" /></span><span><span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">{c.addressLabel}</span><span className="mt-0.5 block text-[14.5px] font-semibold text-white/85">{pick(siteConfig.address, locale)}</span></span></li>
                  <li className="flex items-start gap-3.5"><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#60B8FF]/25 bg-[#0B2245] text-[#60B8FF]"><Clock className="h-4 w-4" /></span><span><span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">{c.hoursLabel}</span><span className="mt-0.5 block text-[14.5px] font-semibold text-white/85">{pick(siteConfig.workingHours, locale)}</span></span></li>
                </ul>
                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">{c.followLabel}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {socials.map(({ href, label, Icon }) => (<a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#60B8FF]/25 text-[#60B8FF] transition hover:border-[#FFF83F] hover:text-[#FFF83F]"><Icon className="h-4 w-4" /></a>))}
                    <a href={whatsappHref(siteConfig.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FFF83F]/40 bg-[#FFF83F]/10 text-[#FFF83F] transition hover:bg-[#FFF83F] hover:text-[#07162D]"><MessageCircle className="h-4 w-4" /></a>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="rounded-[32px] border border-[#60B8FF]/20 bg-[#0B2245] p-7">
                <div className="flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF83F]/15 text-[#FFF83F]"><Clock className="h-4 w-4" /></span><h3 className="text-[15px] font-extrabold text-white">{c.responseTitle}</h3></div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">{c.responseBody}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#07162D] pb-20 md:pb-28">
        <div className="shell">
          <Reveal>
            <div className="overflow-hidden rounded-[32px] border border-[#60B8FF]/20 bg-[#040B14]">
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 text-white">
                <h2 className="text-[16px] font-extrabold">{c.mapTitle}</h2>
                <span className="text-[12px] font-semibold text-white/45">{pick(siteConfig.address, locale)}</span>
              </div>
              <iframe title={c.mapTitle} src="https://www.google.com/maps?q=Shebin+El-Kom,+Menoufia,+Egypt&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[320px] w-full border-0 opacity-90 md:h-[380px]" />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#60B8FF]/15 px-6 py-4">
                <p className="text-[12px] text-white/45">{pick(siteConfig.workingHours, locale)}</p>
                <a href="https://www.google.com/maps/search/?api=1&query=Shebin+El-Kom%2C+Menoufia%2C+Egypt" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#60B8FF] transition hover:text-[#FFF83F]">{c.mapLink}<ExternalArrow className="h-3.5 w-3.5" /></a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
