"use client";

import { useEffect, useRef, useState } from "react";
import { Gamepad2, Sparkles } from "lucide-react";
import { useGame } from "./GameProvider";
import { LogoMark } from "@/components/ui/Logo";
import { intro } from "@/content/playground";
import { pick, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Phase = "loading" | "welcome" | "question" | "boot" | "closed";

export function IntroScreen({ locale }: { locale: Locale }) {
  const { hydrated, data, hideIntro, sound } = useGame();
  const [phase, setPhase] = useState<Phase>("loading");
  const [step, setStep] = useState(0);
  const startRef = useRef<HTMLButtonElement>(null);
  const reduce = !data.motionOn;

  useEffect(() => {
    if (!hydrated) return;
    let seen = false;
    let hidden = data.introHidden;
    try {
      seen = window.sessionStorage.getItem("rawaj-intro-seen") === "1";
      hidden = hidden || window.localStorage.getItem("rawaj-intro-hidden") === "1";
    } catch {}
    if (seen || hidden) { setPhase("closed"); return; }
    const timer = window.setTimeout(() => setPhase("welcome"), reduce ? 0 : 400);
    return () => window.clearTimeout(timer);
  }, [hydrated, data.introHidden, reduce]);

  useEffect(() => {
    if (phase !== "boot") return;
    const timers = intro.boot.map((_, index) => window.setTimeout(() => setStep(index + 1), 400 * (index + 1)));
    const finish = window.setTimeout(() => { hideIntro(); setPhase("closed"); }, 400 * intro.boot.length + 600);
    return () => { timers.forEach(window.clearTimeout); window.clearTimeout(finish); };
  }, [phase, hideIntro]);

  useEffect(() => { if (phase === "welcome") startRef.current?.focus(); }, [phase]);
  useEffect(() => {
    if (phase === "loading" || phase === "closed") return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  const close = () => { hideIntro(); setPhase("closed"); sound("click"); };
  const begin = () => { sound("pop"); setPhase("question"); };
  const boot = () => { sound("win"); setPhase("boot"); };

  if (phase === "loading" || phase === "closed") return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={pick(intro.welcome, locale)} className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#03080F] p-4">
      <div className="relative z-10 w-full max-w-xl border-4 border-[#2391FF] bg-[#0A1626] p-6 text-center sm:p-8" style={{ boxShadow: "8px 8px 0 0 #040B14, inset 2px 2px 0 0 #14243a" }}>
        <div className="mx-auto flex h-24 w-24 items-center justify-center"><LogoMark className="h-20 w-20" /></div>
        <p className="pixel-label mt-5">{pick(intro.kicker, locale)}</p>

        {phase === "welcome" ? (
          <div>
            <h1 className="font-display mt-3 text-[clamp(2rem,6vw,3rem)] font-black leading-tight text-white" style={{ textShadow: "3px 3px 0 #040b14" }}>{pick(intro.welcome, locale)}</h1>
            <p className="mt-3 text-[17px] font-bold text-[#FFF83F]">{pick(intro.line, locale)}</p>
            <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-ink/70">{locale === "ar" ? "هتختار اسم براندك وألوانه، تخطط، تجدول، تعلن، وتطلق — وتفتح خدمات رَواج واحدة واحدة. مفيش تسجيل ولا بيانات." : "Name your brand, plan, schedule, advertise, and launch — unlocking RAWAJ services as you go. No signup, no data."}</p>
            <div className="mt-7 flex flex-col items-center gap-3">
              <button ref={startRef} type="button" onClick={begin} className="btn-accent w-full max-w-[280px] !py-4 text-base"><Gamepad2 className="h-5 w-5" />{locale === "ar" ? "ابدأ المغامرة" : "Start the adventure"}</button>
              <button type="button" onClick={close} className="text-[12.5px] font-semibold text-ink/50 underline-offset-4 hover:text-ink hover:underline">{pick(intro.skip, locale)}</button>
            </div>
            <button type="button" onClick={() => { hideIntro(true); setPhase("closed"); }} className="mt-6 text-[11px] font-semibold text-ink/30 hover:text-ink/70">{pick(intro.never, locale)}</button>
          </div>
        ) : null}

        {phase === "question" ? (
          <div>
            <h2 className="font-display mt-3 text-[clamp(1.6rem,5vw,2.4rem)] font-black leading-tight text-white">{pick(intro.question, locale)}</h2>
            <p className="pixel-label mt-3 text-ink/40">{locale === "ar" ? "الاختيار مش إجباري… بس مهم" : "Optional… but important"}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={boot} className="btn-accent !py-3.5">{pick(intro.yes, locale)}</button>
              <button type="button" onClick={() => { sound("lose"); setPhase("boot"); }} className="btn-outline !py-3.5">{pick(intro.unsure, locale)}</button>
            </div>
            <p className="mt-4 text-[12px] text-ink/40">{pick(intro.unsureReply, locale)}</p>
          </div>
        ) : null}

        {phase === "boot" ? (
          <div>
            <h2 className="font-display mt-3 text-2xl font-black text-white">{locale === "ar" ? "جاري الدخول…" : "Entering…"}</h2>
            <div className="mx-auto mt-5 h-5 w-full max-w-sm overflow-hidden border-2 border-[#1A2D45] bg-[#040B14] p-[2px]">
              <div className="h-full bg-[#2391FF] transition-none" style={{ width: `${Math.max(6, (step / intro.boot.length) * 100)}%` }} />
            </div>
            <ul className="mx-auto mt-5 space-y-2 text-start text-[13px] font-semibold text-ink/60">
              {intro.boot.map((line, index) => (
                <li key={line.en} className={cn("flex items-center gap-2", index < step ? "text-ink/90" : "text-ink/30")}>
                  <span className={cn("inline-block h-2 w-2", index < step ? "bg-[#FFF83F]" : "bg-[#1A2D45]")} />
                  {pick(line, locale)}
                  {index < step ? <Sparkles className="ms-auto h-3 w-3 text-[#FFF83F]" /> : null}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] text-ink/35">{pick(intro.loadingNote, locale)}</p>
          </div>
        ) : null}

        <p className="mt-6 text-[11px] text-ink/30">{locale === "ar" ? "يمكنك تخطي أي نشاط في أي وقت — المحتوى المهني متاح دائمًا." : "You can skip any activity at any time — the professional content is always available."}</p>
      </div>
    </div>
  );
}