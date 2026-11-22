"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Brain,
  Check,
  HelpCircle,
  Lock,
  Puzzle,
  RefreshCw,
  Scale,
  Search,
  Sparkles,
  Target,
  User,
  Zap,
} from "lucide-react";
import { useGame } from "../GameProvider";
import { Modal } from "../Modal";
import { MiniGame } from "../MiniGames";
import { TrapsSection } from "../traps/Traps";
import { games, type GameId } from "@/content/playground";
import { pick, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const icons: Record<GameId, typeof Zap> = {
  reaction: Zap,
  memory: Brain,
  logo: Award,
  quiz: HelpCircle,
  odd: Puzzle,
  spot: Search,
  target: Target,
  wheel: RefreshCw,
  personality: User,
  wyr: Scale,
};

export function PlayHub({ locale }: { locale: Locale }) {
  const { data, level, hydrated } = useGame();
  const [active, setActive] = useState<GameId | null>(null);
  const meta = active ? games.find((game) => game.id === active) ?? null : null;

  return (
    <div>
      <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="pixel-label">{locale === "ar" ? "لوحة اللاعب" : "PLAYER BOARD"}</p>
          <p className="mt-1.5 text-[19px] font-black text-ink">
            {pick(level.current.label, locale)}{" "}
            <span className="text-[12px] font-bold text-ink/35">{level.current.code}</span>
          </p>
          <p className="mt-1 text-[12px] text-ink/45">
            {hydrated
              ? level.next
                ? locale === "ar"
                  ? `${data.xp} XP — باقي ${level.remaining} نقطة للمستوى التالي`
                  : `${data.xp} XP — ${level.remaining} to the next level`
                : locale === "ar"
                  ? `${data.xp} XP — أعلى مستوى`
                  : `${data.xp} XP — top level`
              : locale === "ar"
                ? "جاري تحميل تقدمك…"
                : "Loading your progress…"}
          </p>
        </div>
        <div className="sm:w-64">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent transition-all duration-700"
              style={{ width: `${Math.max(4, level.progress * 100)}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink/30">
            <span>{hydrated ? `${data.completed.length}/${games.length} ${locale === "ar" ? "مكتملة" : "done"}` : "—"}</span>
            <span>{hydrated ? `${data.xp} XP` : ""}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game, index) => {
          const Icon = icons[game.id];
          const done = data.completed.includes(game.id);
          return (
            <motion.button
              key={game.id}
              type="button"
              onClick={() => setActive(game.id)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
              whileHover={{ y: -4 }}
              className="quest-card group flex h-full flex-col text-start"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-200 transition group-hover:bg-accent group-hover:text-onAccent">
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wide",
                    done ? "bg-accent/15 text-accent" : "bg-white/5 text-ink/35",
                  )}
                >
                  {done ? <Check className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
                  {done ? (locale === "ar" ? "مكتملة" : "DONE") : `+${game.xp} XP`}
                </span>
              </div>
              <h3 className="mt-3 text-[15.5px] font-extrabold text-ink">{pick(game.title, locale)}</h3>
              <p className="mt-1 flex-1 text-[12px] leading-relaxed text-ink/45">
                {pick(game.desc, locale)}
              </p>
              <span className="mt-3 flex items-center justify-between">
                <span className="pixel-label text-[8px] text-ink/25">{pick(game.tag, locale)}</span>
                <span className="text-[11.5px] font-bold text-brand-200 transition group-hover:text-accent">
                  {locale === "ar" ? "العب" : "Play"} ←
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 flex items-center gap-3">
        <Sparkles className="h-4 w-4 text-accent" />
        <h2 className="text-[17px] font-extrabold text-ink">
          {locale === "ar" ? "مقالب خفيفة (آمنة تمامًا)" : "Light pranks (totally safe)"}
        </h2>
      </div>
      <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink/45">
        {locale === "ar"
          ? "كلها مزاح رقمي واضح ومكتوب — لا تسجيل، لا بيانات، لا اختراق. لو مش في المزاج، تجاهلها وكمل للشغل."
          : "Clear, labeled digital jokes — no signup, no data, no hacking. Not in the mood? Skip them and get to the work."}
      </p>
      <div className="mt-4">
        <TrapsSection locale={locale} />
      </div>

      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        title={meta ? pick(meta.title, locale) : ""}
        eyebrow={
          meta ? `${pick(meta.tag, locale)} · +${meta.xp} XP` : undefined
        }
        wide
      >
        {active ? <MiniGame key={active} id={active} locale={locale} /> : null}
      </Modal>
    </div>
  );
}
