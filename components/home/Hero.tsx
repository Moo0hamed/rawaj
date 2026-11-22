"use client";

import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Sparkles, TrendingUp } from "lucide-react";
import { Arrow } from "@/components/ui/Arrows";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  dict: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    titleBottom: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    badge: string;
    floatingCard: { title: string; value: string; body: string };
    secondaryCard: { title: string; value: string; body: string };
    marquee: string;
  };
  clientsLabel: string;
  stats: { value: number; label: string };
};

export function Hero({ locale, dict, clientsLabel, stats }: Props) {
  return (
    <section className="relative overflow-hidden border-b-4 border-[#2391FF] bg-[#03080F] text-white">
      <div className="shell relative grid items-center gap-10 pb-14 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-20 lg:pt-14">
        <div>
          <div className="inline-flex items-center gap-2 border-2 border-[#1A2D45] bg-[#0A1626] px-2 py-1.5" style={{ boxShadow: "3px 3px 0 0 #040B14" }}>
            <span className="inline-flex items-center gap-1.5 border-2 border-[#040B14] bg-[#FFF83F] px-2 py-1 text-[11px] font-black text-[#040B14]">
              <Sparkles className="h-3 w-3" />
              {locale === "ar" ? "رَواج" : "RAWAJ"}
            </span>
            <span className="pe-2 text-[12.5px] font-semibold text-white/80">{dict.badge}</span>
          </div>

          <h1 className="font-display mt-6 text-display-lg font-black text-white" style={{ textShadow: "4px 4px 0 #040b14" }}>
            <span className="block">{dict.titleTop}</span>
            <span className="mt-1 inline-block border-b-8 border-[#FFF83F] pb-1">{dict.titleAccent}</span>
            <span className="mt-3 block text-[0.56em] font-extrabold leading-tight text-white/70">{dict.titleBottom}</span>
          </h1>

          <p className="mt-6 max-w-xl border-s-4 border-[#2391FF] ps-4 text-[16px] leading-[1.85] text-white/75">{dict.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={`/${locale}/contact`} className="btn-accent !px-6 !py-3.5">
              {dict.primaryCta}
              <Arrow locale={locale} />
            </Link>
            <Link href={`/${locale}/work`} className="btn-ghost-dark !px-6 !py-3.5">
              {dict.secondaryCta}
              <Arrow locale={locale} />
            </Link>
            <Link href={`/${locale}/play`} className="inline-flex items-center gap-2 border-2 border-[#FFF83F] bg-[#1a1600] px-4 py-2.5 text-[12.5px] font-bold text-[#FFF83F]">
              <Gamepad2 className="h-4 w-4" />
              {locale === "ar" ? "استراحة اللعب" : "Playground"}
              <span className="border border-[#040B14] bg-[#FFF83F] px-1.5 py-0.5 text-[9px] font-black text-[#040B14]">XP</span>
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-4 border-t-4 border-[#1A2D45] pt-6">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {["team-ahmed", "team-sara", "team-youssef", "team-mariam"].map((id) => (
                <span key={id} className="relative h-9 w-9 overflow-hidden border-2 border-[#2391FF] bg-[#0A1626]">
                  <Image src={`/images/${id}.jpg`} alt="" fill sizes="36px" className="object-cover" style={{ imageRendering: "pixelated" }} />
                </span>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black leading-none text-[#FFF83F]">{stats.value}+</span>
                <span className="text-[12px] font-semibold text-white/60">{clientsLabel}</span>
              </div>
              <p className="mt-1 text-[12px] text-white/50">{locale === "ar" ? "علامة وثقت بنا" : "brands trusted us"}</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative overflow-hidden border-4 border-[#2391FF] bg-[#0A1626]" style={{ boxShadow: "8px 8px 0 0 #040B14" }}>
            <Image
              src="/images/hero-team.jpg"
              alt={locale === "ar" ? "فريق رَواج أثناء جلسة عمل إبداعية" : "The RAWAJ team during a creative session"}
              width={1400}
              height={1750}
              priority
              sizes="(max-width: 1024px) 90vw, 520px"
              className="h-[420px] w-full object-cover sm:h-[520px]"
              style={{ imageRendering: "auto" }}
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 border-4 border-[#1A2D45] bg-[#050D1A] p-4">
              <div>
                <p className="font-pixel text-[8px] text-[#7CC6FF]">{dict.floatingCard.title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-2xl font-black text-[#FFF83F]"><TrendingUp className="h-5 w-5" />{dict.floatingCard.value}</p>
              </div>
              <p className="max-w-[120px] text-end text-[11px] leading-snug text-white/60">{dict.floatingCard.body}</p>
            </div>
          </div>

          <div className="absolute -start-4 top-6 hidden border-4 border-[#040B14] bg-[#FFF83F] px-4 py-3 text-[#040B14] sm:block" style={{ boxShadow: "4px 4px 0 0 #040B14" }}>
            <p className="font-pixel text-[8px] text-[#040B14]/70">{dict.secondaryCard.title}</p>
            <p className="text-2xl font-black leading-none">{dict.secondaryCard.value}</p>
          </div>
        </div>
      </div>

      <div className="relative border-y-4 border-[#040B14] bg-[#FFF83F] text-[#040B14]" aria-hidden="true">
        <div className="flex overflow-hidden py-3" dir="ltr">
          <div className="flex shrink-0 items-center gap-6 pe-6 text-[13px] font-black uppercase tracking-[0.12em] whitespace-nowrap motion-safe:animate-marquee">
            {Array.from({ length: 10 }).map((_, index) => (
              <span key={index} className="flex items-center gap-6">{dict.marquee}<span className="inline-block h-2 w-2 bg-[#040B14]" /></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}