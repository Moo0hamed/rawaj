"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, PartyPopper, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useGame } from "../GameProvider";
import { Modal } from "../Modal";
import { trapCopy, traps } from "@/content/playground";
import { pick, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type TrapId = (typeof traps)[number]["id"];

const toneClass: Record<string, string> = {
  blue: "border-brand-400/35 hover:border-brand-300/70",
  yellow: "border-accent/35 hover:border-accent/70",
};

export function TrapInvite({
  trap,
  locale,
  onOpen,
  compact,
}: {
  trap: (typeof traps)[number];
  locale: Locale;
  onOpen: () => void;
  compact?: boolean;
}) {
  const seen = useGame().data.trapsSeen.includes(trap.id);
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-surface/70 p-5 text-start transition",
        toneClass[trap.tone],
        compact && "p-4",
      )}
    >
      <span className="pointer-events-none absolute -end-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20" />
      <span className="flex items-center justify-between gap-2">
        <span className="pixel-label text-[8px] text-ink/30">
          {locale === "ar" ? "مقلب محتمل" : "MIGHT BE A PRANK"}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide",
            seen ? "bg-white/5 text-ink/35" : "bg-accent/15 text-accent",
          )}
        >
          {seen ? (locale === "ar" ? "تم" : "DONE") : `+${trap.xp} XP`}
        </span>
      </span>
      <span className={cn("mt-3 block text-[16px] font-extrabold text-ink", compact && "text-[14.5px]")}>
        {pick(trap.title, locale)}
      </span>
      <span className="mt-1 block text-[12.5px] leading-relaxed text-ink/50">
        {pick(trap.hook, locale)}
      </span>
      <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-200">
        {pick(trap.cta, locale)}
        <span aria-hidden="true" className="transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
          ←
        </span>
      </span>
    </motion.button>
  );
}

export function TrapsSection({ locale, compact }: { locale: Locale; compact?: boolean }) {
  const [active, setActive] = useState<TrapId | null>(null);
  const { data } = useGame();
  if (!data.trapsOn) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white/[0.015] p-4 text-[12px] text-ink/40">
        {locale === "ar"
          ? "المقالب متوقفة من إعدادات اللاعب. تقدر تشغّلها في أي وقت من بطاقة الإعدادات أسفل الشاشة."
          : "Pranks are off in player settings. You can enable them anytime from the settings card at the bottom."}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {traps.map((trap) => (
          <TrapInvite
            key={trap.id}
            trap={trap}
            locale={locale}
            compact={compact}
            onOpen={() => setActive(trap.id)}
          />
        ))}
      </div>
      <TrapModal id={active} locale={locale} onClose={() => setActive(null)} />
    </div>
  );
}

export function TrapModal({
  id,
  locale,
  onClose,
}: {
  id: TrapId | null;
  locale: Locale;
  onClose: () => void;
}) {
  const { data, markTrap, addXp, sound } = useGame();
  const trap = traps.find((item) => item.id === id) ?? null;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [phase, setPhase] = useState<"run" | "loading" | "reveal">("run");
  const [luckResult, setLuckResult] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState(0);

  useEffect(() => {
    setStep(0);
    setAnswers([]);
    setPhase("run");
    setLuckResult(null);
    setSpinCount(0);
  }, [id]);

  useEffect(() => {
    if (!trap) return;
    if (phase !== "reveal") return;
    if (!data.trapsSeen.includes(trap.id)) addXp(trap.xp, pick(trap.title, locale));
    markTrap(trap.id);
    sound("win");
  }, [phase, trap, data.trapsSeen, addXp, markTrap, locale, sound]);

  if (!trap) return null;

  const disclaimer = (text: string) => (
    <div className="mt-5 rounded-xl border border-accent/25 bg-accent/[0.06] p-3.5">
      <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-accent">
        <ShieldCheck className="h-3.5 w-3.5" />
        {locale === "ar" ? "إخلاء مسؤولية" : "Disclaimer"}
      </p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-ink/60">{text}</p>
    </div>
  );

  const reveal = (title: string, body: string, after: string, winLabel: string) => (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.7, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-onAccent"
      >
        <PartyPopper className="h-7 w-7" />
      </motion.div>
      <h3 className="mt-4 text-[22px] font-black text-ink">{title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{body}</p>
      {disclaimer(after)}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3 py-1.5 text-[11.5px] font-bold text-brand-200">
          <Zap className="h-3.5 w-3.5" /> +{trap.xp} XP · {winLabel}
        </span>
        <button type="button" onClick={onClose} className="btn-accent !px-4 !py-2 text-[12px]">
          {locale === "ar" ? "تمام، كمّل" : "Okay, continue"}
        </button>
      </div>
    </div>
  );

  const progressLine = (index: number, total: number) => (
    <div className="mb-4 flex items-center gap-2" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full",
            i < index ? "bg-accent" : "bg-white/10",
          )}
        />
      ))}
    </div>
  );

  const questionBlock = (
    questions: { q: { ar: string; en: string }; options: { ar: string; en: string }[] }[],
    onDone: () => void,
  ) => {
    const current = questions[step];
    return (
      <div>
        {progressLine(step, questions.length)}
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">
          {locale === "ar" ? `سؤال ${step + 1} من ${questions.length}` : `Question ${step + 1} of ${questions.length}`}
        </p>
        <h3 className="mt-2 text-[17px] font-extrabold leading-snug text-ink">
          {pick(current.q, locale)}
        </h3>
        <div className="mt-4 grid gap-2">
          {current.options.map((option, index) => (
            <button
              key={option.en}
              type="button"
              onClick={() => {
                sound("click");
                const next = [...answers, index];
                setAnswers(next);
                if (step + 1 >= questions.length) {
                  onDone();
                } else {
                  setStep(step + 1);
                }
              }}
              className="option-card text-start text-[13px]"
            >
              <span className="me-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-line text-[10px] font-black text-ink/40">
                {index + 1}
              </span>
              {pick(option, locale)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const loadingBlock = (lines: { ar: string; en: string }[]) => {
    const shown = Math.min(lines.length, Math.floor(step) + 1);
    return (
      <div className="py-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          className="mx-auto h-9 w-9 rounded-full border-2 border-white/10 border-t-accent"
        />
        <p className="mt-4 text-[15px] font-extrabold text-ink">{pick(lines[shown - 1], locale)}</p>
        <div className="mx-auto mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-accent"
            initial={{ width: "6%" }}
            animate={{ width: `${(shown / lines.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="mt-3 text-[11px] text-ink/30">
          {locale === "ar" ? "لا تتحرك… تقريبًا." : "Don't move… almost."}
        </p>
      </div>
    );
  };

  let body: React.ReactNode = null;
  let title = pick(trap.title, locale);

  if (trap.id === "personality-trap") {
    title = pick(trap.title, locale);
    if (phase === "reveal") {
      body = reveal(
        pick(trapCopy.personality.reveal, locale),
        locale === "ar"
          ? "شخصيتك: شخص بيحب الضحك، وبياخد الشغل بجدية من غير ما ياخد نفسه بجدية."
          : "Your type: someone who loves a laugh and takes the work seriously without taking themselves seriously.",
        pick(trapCopy.personality.after, locale),
        locale === "ar" ? "مقلب مكتمل" : "Prank completed",
      );
    } else if (phase === "loading") {
      body = loadingBlock(trapCopy.personality.loading);
    } else {
      body = questionBlock(trapCopy.personality.questions, () => {
        setPhase("loading");
        const total = trapCopy.personality.loading.length;
        trapCopy.personality.loading.forEach((_, index) => {
          window.setTimeout(() => setStep(index + 1), 700 * (index + 1));
        });
        window.setTimeout(() => setPhase("reveal"), 700 * total + 500);
      });
    }
  }

  if (trap.id === "robot-trap") {
    if (phase === "reveal") {
      body = reveal(
        locale === "ar" ? "نتيجة التحقق" : "Check result",
        pick(trapCopy.robot.result, locale),
        pick(trapCopy.robot.after, locale),
        locale === "ar" ? "مقلب مكتمل" : "Prank completed",
      );
    } else if (phase === "loading") {
      body = loadingBlock(trapCopy.personality.loading);
    } else {
      body = questionBlock(trapCopy.robot.questions, () => {
        setPhase("loading");
        const total = trapCopy.personality.loading.length;
        trapCopy.personality.loading.forEach((_, index) => {
          window.setTimeout(() => setStep(index + 1), 700 * (index + 1));
        });
        window.setTimeout(() => setPhase("reveal"), 700 * total + 500);
      });
    }
  }

  if (trap.id === "luck-trap") {
    if (phase === "reveal") {
      body = reveal(
        locale === "ar" ? "النتيجة النهائية" : "Final result",
        luckResult ?? "",
        pick(trapCopy.luck.after, locale),
        locale === "ar" ? "مقلب مكتمل" : "Prank completed",
      );
    } else {
      body = (
        <div className="text-center">
          <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
            <motion.div
              animate={phase === "loading" ? { rotate: 360 * 4 } : { rotate: spinCount * 45 }}
              transition={{ duration: phase === "loading" ? 1.6 : 0.6, ease: "easeOut" }}
              className="h-32 w-32 rounded-full border-[10px] border-white/10"
              style={{
                borderTopColor: "#FFF83F",
                borderRightColor: "#2391FF",
                borderBottomColor: "rgba(255,248,63,0.35)",
                borderLeftColor: "rgba(35,145,255,0.35)",
              }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-surface text-[11px] font-black text-ink/50">
                {phase === "loading" ? "…" : "SPIN"}
              </div>
            </motion.div>
          </div>
          <p className="mt-5 text-[13px] text-ink/55">
            {phase === "loading"
              ? pick(trapCopy.luck.spinning, locale)
              : locale === "ar"
                ? "اضغط الزر وشوف حظك… الجائزة غير قابلة للاستئناف."
                : "Press the button and see your luck… no appeals accepted."}
          </p>
          <button
            type="button"
            disabled={phase === "loading"}
            onClick={() => {
              sound("spin");
              setPhase("loading");
              setSpinCount((count) => count + 7);
              window.setTimeout(() => {
                const results = trapCopy.luck.results;
                setLuckResult(pick(results[Math.floor(Math.random() * results.length)], locale));
                setPhase("reveal");
              }, 1900);
            }}
            className="btn-accent mt-6 !px-6 !py-3 text-[14px] disabled:opacity-50"
          >
            {pick(trapCopy.luck.button, locale)}
          </button>
        </div>
      );
    }
  }

  if (trap.id === "danger-trap") {
    if (phase === "reveal") {
      body = reveal(
        locale === "ar" ? "زرار خطير… فعلًا" : "A dangerous button… truly",
        pick(trapCopy.danger.final, locale),
        locale === "ar"
          ? "مفيش أي ضرر حصل، وكل ما سبق مجرد مزحة خفيفة. لا توجد بيانات أو ملفات أو حسابات تأثرت."
          : "Nothing bad happened. Everything above was a light prank; no data, files, or accounts were affected.",
        locale === "ar" ? "مقلب مكتمل" : "Prank completed",
      );
    } else if (phase === "loading") {
      body = loadingBlock(trapCopy.danger.steps);
    } else {
      body = (
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/40 bg-red-500/10">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="mt-4 text-[20px] font-black text-ink">
            {pick(trapCopy.danger.label, locale)}
          </h3>
          <p className="mt-2 text-[12.5px] text-ink/50">
            {locale === "ar"
              ? "بنقولك لأ. بجد. متضغطش. (بس لو فضولك غلبك، إحنا مش هنزعل.)"
              : "We're telling you no. Seriously. Don't. (But if curiosity wins, we won't be upset.)"}
          </p>
          <button
            type="button"
            onClick={() => {
              sound("error");
              setPhase("loading");
              trapCopy.danger.steps.forEach((_, index) => {
                window.setTimeout(() => setStep(index + 1), 620 * (index + 1));
              });
              window.setTimeout(
                () => setPhase("reveal"),
                620 * trapCopy.danger.steps.length + 600,
              );
            }}
            className="btn-outline mt-6 !px-6 !py-3 text-[13.5px] hover:border-red-400/60 hover:text-red-300"
          >
            {pick(trap.cta, locale)}
          </button>
        </div>
      );
    }
  }

  return (
    <Modal
      open={Boolean(id)}
      onClose={onClose}
      title={title}
      eyebrow={
        locale === "ar"
          ? `مقلب · +${trap.xp} XP`
          : `PRANK · +${trap.xp} XP`
      }
    >
      {body}
      <p className="mt-5 flex items-center justify-center gap-1.5 text-[10.5px] text-ink/25">
        <Sparkles className="h-3 w-3" />
        {locale === "ar"
          ? "كل المقالب آمنة 100% ولا تجمع أي بيانات."
          : "All pranks are 100% safe and collect no data."}
      </p>
    </Modal>
  );
}
