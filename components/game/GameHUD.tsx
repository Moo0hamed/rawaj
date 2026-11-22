"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Lock, RotateCcw, Trophy, Volume2, VolumeX, Zap, Sparkles } from "lucide-react";
import { useGame } from "./GameProvider";
import { Modal } from "./Modal";
import { games, traps } from "@/content/playground";
import { pick, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function GameHUD({ locale }: { locale: Locale }) {
  const { data, level, toggleSound, toggleMotion, reset, hydrated } = useGame();
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!hydrated) return null;

  const completedGames = games.filter((game) => data.completed.includes(game.id)).length;
  const completedTraps = traps.filter((trap) => data.trapsSeen.includes(trap.id)).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="safe-bottom fixed bottom-4 end-4 z-[80]"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={
            locale === "ar"
              ? `ملف اللاعب: المستوى ${level.current.code}، ${data.xp} نقطة`
              : `Player profile: ${level.current.code}, ${data.xp} XP`
          }
          className="group flex items-center gap-3 rounded-2xl border border-brand-400/35 bg-abyss/90 py-2 pe-4 ps-2 shadow-[0_0_40px_-16px_rgba(35,145,255,0.9)] backdrop-blur-md transition hover:border-accent/60"
        >
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-accent">
            <Trophy className="h-5 w-5" />
            <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-black text-onAccent">
              {level.index + 1}
            </span>
          </span>
          <span className="text-start">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-brand-200">
              {level.current.code}
              <span className="text-ink/30">·</span>
              <span className="text-accent">{data.xp} XP</span>
            </span>
            <span className="mt-1 flex h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
              <span
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent"
                style={{ width: `${Math.max(5, level.progress * 100)}%` }}
              />
            </span>
          </span>
          <Gamepad2 className="h-4 w-4 text-ink/30 transition group-hover:text-accent" />
        </button>
      </motion.div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setConfirmReset(false);
        }}
        title={locale === "ar" ? "ملف اللاعب" : "Player profile"}
        eyebrow="PLAYER STATS"
      >
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-400/25 bg-brand-500/[0.07] p-4">
          <div>
            <p className="pixel-label">{level.current.code}</p>
            <p className="mt-1 text-[20px] font-black text-ink">
              {pick(level.current.label, locale)}
            </p>
            <p className="mt-1 text-[12px] text-ink/50">
              {level.next
                ? locale === "ar"
                  ? `باقي ${level.remaining} نقطة للمستوى التالي`
                  : `${level.remaining} XP to the next level`
                : locale === "ar"
                  ? "وصلت لأعلى مستوى في رَواج"
                  : "You reached the top RAWAJ level"}
            </p>
          </div>
          <div className="text-end">
            <p className="text-[28px] font-black leading-none text-accent">{data.xp}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/40">XP</p>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-300 to-accent transition-all duration-700"
            style={{ width: `${Math.max(5, level.progress * 100)}%` }}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-line bg-white/[0.02] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">
              {locale === "ar" ? "ألعاب مكتملة" : "Games done"}
            </p>
            <p className="mt-1 text-[20px] font-black">
              {completedGames}
              <span className="text-[12px] font-bold text-ink/35"> / {games.length}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white/[0.02] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">
              {locale === "ar" ? "مقالب مفتوحة" : "Pranks opened"}
            </p>
            <p className="mt-1 text-[20px] font-black">
              {completedTraps}
              <span className="text-[12px] font-bold text-ink/35"> / {traps.length}</span>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="flex items-center gap-2 text-[12.5px] font-extrabold text-ink/70">
            <Sparkles className="h-4 w-4 text-accent" />
            {locale === "ar" ? "الإنجازات" : "Achievements"}
          </p>
          <ul className="mt-3 grid gap-2">
            {games.map((game) => {
              const done = data.completed.includes(game.id);
              return (
                <li
                  key={game.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-[12.5px] font-semibold",
                    done
                      ? "border-accent/30 bg-accent/[0.07] text-ink"
                      : "border-line bg-white/[0.02] text-ink/45",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {done ? (
                      <Zap className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                    {pick(game.title, locale)}
                  </span>
                  <span className={done ? "text-accent" : "text-ink/25"}>
                    {done ? `+${game.xp}` : `${game.xp} XP`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 grid gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="flex items-center justify-between rounded-xl border border-line bg-white/[0.02] px-3.5 py-3 text-[13px] font-semibold transition hover:border-brand-400/40"
          >
            <span className="flex items-center gap-2">
              {data.soundOn ? (
                <Volume2 className="h-4 w-4 text-brand-300" />
              ) : (
                <VolumeX className="h-4 w-4 text-ink/40" />
              )}
              {locale === "ar" ? "أصوات اللعبة" : "Game sounds"}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-black uppercase",
                data.soundOn ? "bg-accent text-onAccent" : "bg-white/10 text-ink/50",
              )}
            >
              {data.soundOn ? "ON" : "OFF"}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleMotion}
            className="flex items-center justify-between rounded-xl border border-line bg-white/[0.02] px-3.5 py-3 text-[13px] font-semibold transition hover:border-brand-400/40"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-300" />
              {locale === "ar" ? "حركات وانتقالات" : "Motion & transitions"}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-black uppercase",
                data.motionOn ? "bg-accent text-onAccent" : "bg-white/10 text-ink/50",
              )}
            >
              {data.motionOn ? "ON" : "OFF"}
            </span>
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Link
            href={`/${locale}/play`}
            onClick={() => setOpen(false)}
            className="btn-accent !px-4 !py-2.5 text-[12.5px]"
          >
            {locale === "ar" ? "كل الألعاب" : "All games"}
          </Link>
          {confirmReset ? (
            <button
              type="button"
              onClick={() => {
                reset();
                setConfirmReset(false);
              }}
              className="rounded-full bg-red-500/15 px-3 py-2 text-[11.5px] font-bold text-red-300"
            >
              {locale === "ar" ? "تأكيد التصفير" : "Confirm reset"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink/35 transition hover:text-ink/70"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {locale === "ar" ? "تصفير التقدم" : "Reset progress"}
            </button>
          )}
        </div>

        <p className="mt-4 text-[10.5px] leading-relaxed text-ink/25">
          {locale === "ar"
            ? "نقاطك محفوظة على جهازك فقط (LocalStorage) ولا تُرسل لأي خادم."
            : "Your XP is stored only on your device (LocalStorage) and never sent to a server."}
        </p>
      </Modal>
    </>
  );
}
