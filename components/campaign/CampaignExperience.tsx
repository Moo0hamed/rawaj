"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Coins,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Phone,
  SkipForward,
  Sparkles,
} from "lucide-react";
import { useGame } from "@/components/game/GameProvider";
import { Modal } from "@/components/game/Modal";
import {
  AdsStage,
  BossStage,
  CalendarStage,
  IdentityStage,
  LaunchStage,
  ReplayStage,
  ServiceReveal,
  StrategyStage,
  StageTag,
  TeamStage,
} from "./Stages";
import { PixelScene, type SceneKind } from "@/components/pixel/PixelScene";
import { stages } from "@/content/campaign";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";
import { pick, type Locale } from "@/lib/i18n";
import { telHref, whatsappHref } from "@/lib/utils";

const TOTAL = stages.length; // 8
const LAST = TOTAL - 1; // 7

export function CampaignExperience({ locale }: { locale: Locale }) {
  const { data, hydrated, setView, unlockStage } = useGame();
  const [quickOpen, setQuickOpen] = useState(false);
  const view = Math.min(LAST, Math.max(0, data.campaign.view));
  const stage = stages[view];
  const completed = view === LAST ? data.campaign.bossDone : data.campaign.stage > view;
  const sceneByView: SceneKind[] = ["identity","strategy","social","ads","replay","team","launch","boss"];
  const scene = sceneByView[view] ?? "identity";

  useEffect(() => {
    const syncBoss = () => {
      if (window.location.hash === "#boss") {
        setView(LAST);
        window.setTimeout(() => {
          document.getElementById("boss")?.scrollIntoView({ behavior: "auto", block: "start" });
        }, 80);
      }
    };
    syncBoss();
    window.addEventListener("hashchange", syncBoss);
    return () => window.removeEventListener("hashchange", syncBoss);
  }, [setView]);

  const next = () => {
    if (view >= LAST) return;
    if (!completed) unlockStage(view + 1);
    setView(view + 1);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const prev = () => {
    if (view <= 0) return;
    setView(view - 1);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const skip = () => {
    if (view >= LAST) return;
    unlockStage(view + 1);
    setView(view + 1);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="relative overflow-hidden pb-10 pt-8 sm:pt-10" style={{ color: "var(--ink)", background: "transparent" }}>
      <div className="shell relative">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="font-pixel text-[9px] tracking-[0.16em] text-[var(--brand)]">{locale === "ar" ? "حملة رَواج" : "RAWAJ CAMPAIGN"}</p>
            <h1 className="mt-2 text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.15]" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              {locale === "ar" ? "براندك من الصفر… حتى الإطلاق" : "Your brand, from zero… to launch"}
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
              {locale === "ar"
                ? "أنت صاحب براند جديد. في 8 مراحل هتاخد قرارات التسويق اللي رَواج بتعملها مع عملائها — وتقدر تتخطى أي مرحلة وتوصل للتواصل في أي وقت."
                : "You own a new brand. Across 8 stages you'll make the marketing calls RAWAJ makes with clients — and you can skip any stage or jump to contact anytime."}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="inline-flex items-center gap-2 px-3 py-2 text-[11.5px] font-black" style={{ border: "2px solid var(--line)", background: "var(--surface)", color: "var(--ink)", boxShadow: "var(--shadow)" }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
              {data.campaign.brandName || (locale === "ar" ? "براند بدون اسم بعد" : "Unnamed brand")}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-2 text-[11px] font-bold" style={{ border: "2px solid var(--line)", background: "var(--surface)", color: "var(--muted)" }}>
              <Coins className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} />
              {data.coins} {locale === "ar" ? "عملة" : "coins"} · {data.xp} XP
            </span>
            <button type="button" onClick={() => setQuickOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold" style={{ border: "2px solid var(--brand)", background: "transparent", color: "var(--brand)" }}>
              <LayoutGrid className="h-3.5 w-3.5" />
              {locale === "ar" ? "شوف الخدمات بسرعة" : "View services quickly"}
            </button>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 py-3" style={{ borderTop: "2px solid var(--line)", borderBottom: "2px solid var(--line)" }}>
          <div className="flex items-center gap-2.5">
            <StageTag>{stage.code}</StageTag>
            <span className="font-pixel text-[9px]" style={{ color: "var(--muted)" }}>
              {locale === "ar" ? `المرحلة ${view + 1} من ${TOTAL}` : `STAGE ${view + 1} OF ${TOTAL}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={prev} disabled={view === 0} className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold disabled:opacity-25" style={{ border: "2px solid var(--line)", color: "var(--muted)" }}>
              <ArrowRight className="h-3.5 w-3.5 rtl:block ltr:hidden" /><ArrowLeft className="h-3.5 w-3.5 ltr:block rtl:hidden" />
              {locale === "ar" ? "السابق" : "Back"}
            </button>
            {view < LAST ? (
              <button type="button" onClick={skip} className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold" style={{ border: "2px solid var(--line)", color: "var(--muted)" }}>
                <SkipForward className="h-3.5 w-3.5" />{locale === "ar" ? "تخطي" : "Skip"}
              </button>
            ) : null}
          </div>
        </div>

        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-[clamp(1.6rem,3.4vw,2.3rem)]" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>{pick(stage.title, locale)}</h2>
            <p className="mt-1 text-[12.5px]" style={{ color: "var(--muted)" }}>{pick(stage.tagline, locale)}</p>
          </div>
          <div className="relative overflow-hidden" style={{ border: "4px solid var(--line)", background: "var(--surface)", boxShadow: "var(--shadow)" }}>
            <div className="relative h-[180px] sm:h-[220px]" style={{ borderBottom: "4px solid var(--line)" }}>
              <PixelScene kind={scene} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-4" style={{ background: "linear-gradient(180deg,transparent,rgba(0,0,0,.45))" }}>
                <div><p className="font-pixel text-[8px] tracking-[0.14em]" style={{ color: "var(--accent)" }}>{stage.code}</p><p className="mt-1 text-[12px] font-bold text-white">{pick(stage.title, locale)}</p></div>
                <span className="px-2 py-1 font-pixel text-[8px]" style={{ border: "2px solid var(--accent)", background: "rgba(0,0,0,.35)", color: "var(--accent)" }}>THEMED SCENE</span>
              </div>
            </div>
            <div key={view} className="p-4 sm:p-6" style={{ background: "var(--surface)" }}>
              {view === 0 ? <IdentityStage locale={locale} /> : null}
              {view === 1 ? <StrategyStage locale={locale} /> : null}
              {view === 2 ? <CalendarStage locale={locale} /> : null}
              {view === 3 ? <AdsStage locale={locale} /> : null}
              {view === 4 ? <ReplayStage locale={locale} /> : null}
              {view === 5 ? <TeamStage locale={locale} /> : null}
              {view === 6 ? <LaunchStage locale={locale} /> : null}
              {view === 7 ? <div id="boss"><BossStage locale={locale} /></div> : null}
            </div>
          </div>

          {stage.serviceSlug && completed ? (
            <ServiceReveal slug={stage.serviceSlug} locale={locale} />
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ border:"2px solid var(--line)", background:"var(--surface)", boxShadow:"var(--shadow)" }}>
            <p className="text-[11px]" style={{ color:"var(--muted)" }}>
              {hydrated
                ? completed
                  ? locale === "ar"
                    ? "المرحلة مكتملة — تقدر تكمل أو تتخطى."
                    : "Stage complete — continue or skip ahead."
                  : locale === "ar"
                    ? "كمّل المرحلة للمكافأة، أو تخطّيها في أي وقت بدون XP."
                    : "Finish for the reward, or skip anytime without XP."
                : locale === "ar"
                  ? "جاري تحميل تقدمك المحلي…"
                  : "Loading your local progress…"}
            </p>
            <div className="flex items-center gap-2">
              {completed && view < LAST ? (
                <button type="button" onClick={next} className="btn-accent !px-4 !py-2 text-[12px]">
                  {locale === "ar" ? "المرحلة التالية" : "Next stage"}
                  <ArrowLeft className="h-3.5 w-3.5 rtl:block ltr:hidden" />
                  <ArrowRight className="h-3.5 w-3.5 ltr:block rtl:hidden" />
                </button>
              ) : null}
              {!completed && view < LAST ? (
                <button type="button" onClick={skip} className="text-[11.5px] font-bold text-accent/80 hover:text-accent">
                  {locale === "ar" ? "تخطي بدون XP" : "Skip (no XP)"}
                </button>
              ) : null}
              {view === LAST ? (
                <Link href={`/${locale}/contact`} className="btn-accent !px-4 !py-2 text-[12px]">
                  {locale === "ar" ? "ابدأ مشروعك الآن" : "Start your project"}
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <AgencyStrip locale={locale} />
      </div>

      <Modal
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        title={locale === "ar" ? "خدمات رَواج — نظرة سريعة" : "RAWAJ services — quick view"}
        eyebrow={locale === "ar" ? "للمستعجل" : "QUICK ACCESS"}
        wide
      >
        <p className="text-[12.5px] leading-relaxed text-ink/55">
          {locale === "ar"
            ? "ملخص سريع لكل الخدمات. تقدر ترجع للحملة وتلعب كل مرحلة عشان تفهمها بالممارسة — أو تدخل على تفاصيل أي خدمة مباشرة. التخطي متاح دائمًا."
            : "A quick summary of every service. Return to the campaign to learn by doing, or open any service details directly. Skipping is always available."}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="rounded-2xl border border-line bg-white/[0.02] p-4">
              <h3 className="text-[14px] font-extrabold text-ink">{pick(service.title, locale)}</h3>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink/50">{pick(service.short, locale)}</p>
              <Link
                href={`/${locale}/services/${service.slug}`}
                onClick={() => setQuickOpen(false)}
                className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-bold text-accent transition hover:text-brand-200"
              >
                {locale === "ar" ? "تفاصيل الخدمة" : "Service details"}
                <ArrowLeft className="h-3 w-3 rtl:block ltr:hidden" />
                <ArrowRight className="h-3 w-3 ltr:block rtl:hidden" />
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <p className="text-[10.5px] text-ink/35">
            {locale === "ar"
              ? "تقدر تتخطى أي مرحلة في الحملة في أي وقت."
              : "You can skip any campaign stage at any time."}
          </p>
          <button type="button" onClick={() => setQuickOpen(false)} className="btn-accent !px-4 !py-2 text-[12px]">
            {locale === "ar" ? "ارجع للحملة" : "Back to campaign"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function AgencyStrip({ locale }: { locale: Locale }) {
  return (
    <section className="mt-10 grid gap-3 p-4 md:grid-cols-[1.2fr_1fr_1fr]" style={{ border:"2px solid var(--line)", background:"var(--surface)", boxShadow:"var(--shadow)" }}>
      <div>
        <p className="font-pixel text-[8px] uppercase tracking-[0.14em]" style={{ color:"var(--brand)" }}>
          {locale === "ar" ? "رَواج على أرض الواقع" : "RAWAJ IN REAL LIFE"}
        </p>
        <p className="mt-2 text-[12px] leading-relaxed" style={{ color:"var(--muted)" }}>
          {locale === "ar"
            ? "نفس الرحلة اللي لعبتها، بننفذها لعملائنا: هوية، استراتيجية، محتوى، وإعلانات — بقياس واضح."
            : "The same journey you just played, we run for clients: identity, strategy, content, and ads — measured clearly."}
        </p>
      </div>
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-[12px] font-semibold" style={{ color:"var(--muted)" }}>
          <MapPin className="h-3.5 w-3.5" style={{ color:"var(--accent)" }} />
          {locale === "ar" ? "شبين الكوم، المنوفية، مصر" : "Shebin El-Kom, Menoufia, Egypt"}
        </p>
        <a href={telHref(siteConfig.phone)} className="flex items-center gap-2 text-[12px] font-semibold hover:opacity-80" style={{ color:"var(--muted)" }} dir="ltr">
          <Phone className="h-3.5 w-3.5" style={{ color:"var(--accent)" }} />
          {siteConfig.phone}
        </a>
        <a
          href={whatsappHref(siteConfig.whatsapp, locale === "ar" ? "مرحبًا رَواج!" : "Hi RAWAJ!")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[12px] font-semibold hover:opacity-80" style={{ color:"var(--muted)" }}
        >
          <MessageCircle className="h-3.5 w-3.5" style={{ color:"var(--accent)" }} />
          WhatsApp
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11.5px] font-bold">
        <Link href={`/${locale}/services`} className="px-2.5 py-2 text-center text-[11.5px] font-bold transition hover:opacity-80" style={{ border:"2px solid var(--line)", color:"var(--muted)" }}>
          {locale === "ar" ? "الخدمات" : "Services"}
        </Link>
        <Link href={`/${locale}/work`} className="px-2.5 py-2 text-center text-[11.5px] font-bold transition hover:opacity-80" style={{ border:"2px solid var(--line)", color:"var(--muted)" }}>
          {locale === "ar" ? "المهمات" : "Missions"}
        </Link>
        <Link href={`/${locale}/team`} className="px-2.5 py-2 text-center text-[11.5px] font-bold transition hover:opacity-80" style={{ border:"2px solid var(--line)", color:"var(--muted)" }}>
          {locale === "ar" ? "الفريق" : "Team"}
        </Link>
        <Link href={`/${locale}/contact`} className="px-2.5 py-2 text-center text-[11.5px] font-bold transition hover:opacity-80" style={{ border:"2px solid var(--line)", color:"var(--muted)" }}>
          {locale === "ar" ? "تواصل" : "Contact"}
        </Link>
      </div>
    </section>
  );
}