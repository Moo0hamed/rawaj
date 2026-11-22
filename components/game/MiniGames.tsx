"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Coffee,
  Crown,
  Flame,
  Heart,
  Music,
  RotateCcw,
  Rocket,
  Star,
  Target,
  Timer,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useGame } from "./GameProvider";
import {
  games,
  logoRounds,
  marketingQuiz,
  oddRounds,
  personalityGame,
  wheelSegments,
  wyrRounds,
  type GameId,
  type PersonaKey,
} from "@/content/playground";
import { pick, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = { id: GameId; locale: Locale };

export function MiniGame({ id, locale }: Props) {
  switch (id) {
    case "reaction":
      return <ReactionGame locale={locale} />;
    case "memory":
      return <MemoryGame locale={locale} />;
    case "logo":
      return <LogoGame locale={locale} />;
    case "quiz":
      return <QuizGame locale={locale} />;
    case "odd":
      return <OddGame locale={locale} />;
    case "spot":
      return <SpotGame locale={locale} />;
    case "target":
      return <TargetGame locale={locale} />;
    case "wheel":
      return <WheelGame locale={locale} />;
    case "personality":
      return <PersonalityGame locale={locale} />;
    case "wyr":
      return <WyrGame locale={locale} />;
    default:
      return null;
  }
}

function useMeta(id: GameId) {
  return useMemo(() => games.find((game) => game.id === id)!, [id]);
}

function XpPill({ xp, locale }: { xp: number; locale: Locale }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/12 px-2.5 py-1 text-[10.5px] font-black text-accent">
      <Zap className="h-3 w-3" />
      {xp} XP
    </span>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cn("h-1.5 flex-1 rounded-full", index < current ? "bg-accent" : "bg-white/10")}
        />
      ))}
    </div>
  );
}

function ResultCard({
  title,
  sub,
  xp,
  locale,
  onReplay,
  children,
}: {
  title: string;
  sub: string;
  xp: number;
  locale: Locale;
  onReplay?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-accent/25 bg-accent/[0.06] p-5 text-center"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-onAccent">
        <Trophy className="h-6 w-6" />
      </div>
      <p className="mt-3 text-[18px] font-black text-ink">{title}</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink/55">{sub}</p>
      {children}
      <div className="mt-4 flex items-center justify-center gap-2">
        <XpPill xp={xp} locale={locale} />
        {onReplay ? (
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11.5px] font-bold text-ink/60 transition hover:border-accent/50 hover:text-accent"
          >
            <RotateCcw className="h-3 w-3" />
            {locale === "ar" ? "إعادة" : "Replay"}
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}

/* ------------------------------- Reaction ------------------------------- */

function ReactionGame({ locale }: { locale: Locale }) {
  const { complete, sound } = useGame();
  const meta = useMeta("reaction");
  const [status, setStatus] = useState<"idle" | "wait" | "go" | "result" | "early">("idle");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const startedAt = useRef(0);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const start = () => {
    setStatus("wait");
    sound("click");
    timer.current = window.setTimeout(() => {
      startedAt.current = performance.now();
      setStatus("go");
      sound("pop");
    }, 1200 + Math.random() * 2200);
  };

  const hit = () => {
    if (status === "idle" || status === "early" || status === "result") return start();
    if (status === "wait") {
      if (timer.current) window.clearTimeout(timer.current);
      setStatus("early");
      sound("error");
      return;
    }
    const value = Math.round(performance.now() - startedAt.current);
    setMs(value);
    setBest((prev) => (prev === null ? value : Math.min(prev, value)));
    setStatus("result");
    complete("reaction", meta.xp, pick(meta.title, locale));
  };

  const rating =
    ms < 220 ? (locale === "ar" ? "سرعة صاروخ" : "Rocket fast") : ms < 320 ? (locale === "ar" ? "سريع جدًا" : "Very fast") : ms < 450 ? (locale === "ar" ? "كويس" : "Decent") : locale === "ar" ? "بطيء شوية" : "A bit slow";

  return (
    <div>
      <button
        type="button"
        onClick={hit}
        className={cn(
          "flex min-h-[240px] w-full flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center transition",
          status === "go" && "border-accent bg-accent text-onAccent",
          status === "wait" && "border-brand-400/40 bg-brand-500/10",
          status === "early" && "border-red-400/40 bg-red-500/10",
          (status === "idle" || status === "result") && "border-line bg-white/[0.02] hover:border-brand-400/50",
        )}
      >
        <span className="text-[26px] font-black">
          {status === "idle"
            ? locale === "ar"
              ? "اضغط للبدء"
              : "Click to start"
            : status === "wait"
              ? locale === "ar"
                ? "استنى الإشارة…"
                : "Wait for green…"
              : status === "go"
                ? locale === "ar"
                  ? "اضغط!"
                  : "NOW!"
                : status === "early"
                  ? locale === "ar"
                    ? "بدري! جرّب تاني"
                    : "Too soon! Try again"
                  : `${ms} ms`}
        </span>
        <span className={cn("text-[12px] font-semibold", status === "go" ? "text-onAccent/70" : "text-ink/40")}>
          {status === "result"
            ? rating
            : status === "idle"
              ? locale === "ar"
                ? "اختبار سرعة الرد — 3 محاولات كفاية"
                : "Reaction speed test — best of a few tries"
              : status === "early"
                ? locale === "ar"
                  ? "الإشارة لسه مجتش"
                  : "Signal hadn't arrived yet"
                : locale === "ar"
                  ? "لا تضغط قبل ما يبقى أخضر"
                  : "Don't press before it turns green"}
        </span>
      </button>
      <div className="mt-3 flex items-center justify-between text-[11.5px] text-ink/40">
        <span>
          {locale === "ar" ? "أفضل نتيجة:" : "Best:"}{" "}
          <b className="text-ink/70">{best ?? "—"} ms</b>
        </span>
        <XpPill xp={meta.xp} locale={locale} />
      </div>
    </div>
  );
}

/* -------------------------------- Memory -------------------------------- */

const MEMORY_ICONS = [Star, Heart, Zap, Flame, Crown, Rocket, Music, Coffee];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck() {
  const deck = MEMORY_ICONS.flatMap((icon, index) => [
    { key: index, icon },
    { key: index, icon },
  ]);
  return shuffle(deck).map((card, position) => ({ ...card, position }));
}

function MemoryGame({ locale }: { locale: Locale }) {
  const { complete, sound } = useGame();
  const meta = useMeta("memory");
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const lock = useRef(false);

  const restart = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
    lock.current = false;
  };

  const flip = (index: number) => {
    if (lock.current || flipped.includes(index) || matched.includes(index)) return;
    sound("click");
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    lock.current = true;
    const [a, b] = next;
    if (deck[a].key === deck[b].key) {
      window.setTimeout(() => {
        setMatched((prev) => {
          const merged = [...prev, a, b];
          if (merged.length === deck.length) {
            setWon(true);
            complete("memory", meta.xp, pick(meta.title, locale));
            sound("win");
          }
          return merged;
        });
        setFlipped([]);
        lock.current = false;
      }, 320);
    } else {
      window.setTimeout(() => {
        setFlipped([]);
        lock.current = false;
      }, 760);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-[11.5px] text-ink/45">
        <span>{locale === "ar" ? `محاولات: ${moves}` : `Moves: ${moves}`}</span>
        <span>{locale === "ar" ? `${matched.length / 2} / 8 أزواج` : `${matched.length / 2} / 8 pairs`}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {deck.map((card, index) => {
          const open = flipped.includes(index) || matched.includes(index);
          const Icon = card.icon;
          return (
            <button
              key={card.position}
              type="button"
              onClick={() => flip(index)}
              aria-label={open ? undefined : locale === "ar" ? "بطاقة مقلوبة" : "Face-down card"}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl border text-[20px] transition",
                open
                  ? "border-brand-400/40 bg-brand-500/10 text-accent"
                  : "border-line bg-white/[0.04] text-transparent hover:border-brand-400/40",
                matched.includes(index) && "border-accent/40 bg-accent/10 text-accent",
              )}
            >
              {open ? <Icon className="h-6 w-6" /> : <Star className="h-4 w-4 text-white/15" />}
            </button>
          );
        })}
      </div>
      {won ? (
        <div className="mt-4">
          <ResultCard
            title={locale === "ar" ? "ذاكرة حديدية!" : "Iron memory!"}
            sub={locale === "ar" ? `خلصتها في ${moves} محاولة.` : `Cleared in ${moves} moves.`}
            xp={meta.xp}
            locale={locale}
            onReplay={restart}
          />
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------- Logo --------------------------------- */

function LogoShape({ shape, color, accent }: { shape: string; color: string; accent: string }) {
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
      <rect x="2" y="2" width="60" height="60" rx="16" fill={color} />
      {shape === "star" ? (
        <path d="M32 12l5.6 13.4L51 32l-13.4 5.6L32 51l-5.6-13.4L13 32l13.4-5.6L32 12Z" fill={accent} />
      ) : null}
      {shape === "orbit" ? (
        <>
          <circle cx="32" cy="32" r="9" fill={accent} />
          <ellipse cx="32" cy="32" rx="20" ry="8" fill="none" stroke={accent} strokeWidth="3" transform="rotate(-28 32 32)" />
        </>
      ) : null}
      {shape === "triangle" ? (
        <path d="M32 13l18 34H14l18-34Z" fill={accent} />
      ) : null}
      {shape === "bolt" ? (
        <path d="M35 10L20 35h10l-3 19 17-27H33l2-17Z" fill={accent} />
      ) : null}
    </svg>
  );
}

function LogoGame({ locale }: { locale: Locale }) {
  const { complete, sound } = useGame();
  const meta = useMeta("logo");
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = logoRounds[round];

  const next = () => {
    if (round + 1 >= logoRounds.length) {
      setDone(true);
      complete("logo", meta.xp, pick(meta.title, locale));
      return;
    }
    setRound(round + 1);
    setPicked(null);
  };

  if (done) {
    return (
      <ResultCard
        title={locale === "ar" ? `عرفت ${score} من ${logoRounds.length}` : `${score} of ${logoRounds.length} correct`}
        sub={locale === "ar" ? "عينك على الشعارات كويسة." : "Your eye for marks is sharp."}
        xp={meta.xp}
        locale={locale}
      />
    );
  }

  return (
    <div>
      <Progress current={round} total={logoRounds.length} />
      <div className="mt-4 flex flex-col items-center rounded-2xl border border-line bg-white/[0.02] p-5">
        <LogoShape shape={item.shape} color={item.color} accent={item.accent} />
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">
          {locale === "ar" ? "أي علامة هذا الشعار؟" : "Which brand is this?"}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {item.options[locale].map((option, index) => (
          <button
            key={option}
            type="button"
            disabled={picked !== null}
            onClick={() => {
              setPicked(index);
              if (index === item.answer) {
                setScore((value) => value + 1);
                sound("win");
              } else {
                sound("lose");
              }
            }}
            className={cn(
              "rounded-xl border px-3 py-3 text-[13px] font-bold transition",
              picked === null && "border-line bg-white/[0.03] hover:border-brand-400/50",
              picked !== null && index === item.answer && "border-accent/60 bg-accent/10 text-accent",
              picked === index && index !== item.answer && "border-red-400/50 bg-red-500/10 text-red-300",
              picked !== null && index !== item.answer && picked !== index && "border-line text-ink/30",
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {picked !== null ? (
        <button type="button" onClick={next} className="btn-accent mt-4 w-full !py-2.5 text-[12.5px]">
          {round + 1 >= logoRounds.length
            ? locale === "ar"
              ? "شوف النتيجة"
              : "See result"
            : locale === "ar"
              ? "التالي"
              : "Next"}
        </button>
      ) : null}
    </div>
  );
}

/* --------------------------------- Quiz --------------------------------- */

function QuizGame({ locale }: { locale: Locale }) {
  const { complete, sound } = useGame();
  const meta = useMeta("quiz");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const item = marketingQuiz[index];

  if (done) {
    return (
      <ResultCard
        title={
          locale === "ar"
            ? `نتيجتك ${score} / ${marketingQuiz.length}`
            : `You scored ${score} / ${marketingQuiz.length}`
        }
        sub={
          score >= 4
            ? locale === "ar"
              ? "ده مستوى مسوّق حقيقي. احترمناك."
              : "That's real marketer level. We respect it."
            : locale === "ar"
              ? "مش وحش… بس محتاجين قعدة تسويق سريعة."
              : "Not bad… but a quick marketing session wouldn't hurt."
        }
        xp={meta.xp}
        locale={locale}
      />
    );
  }

  return (
    <div>
      <Progress current={index} total={marketingQuiz.length} />
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">
        {locale === "ar" ? `سؤال ${index + 1} من ${marketingQuiz.length}` : `Question ${index + 1} of ${marketingQuiz.length}`}
      </p>
      <h3 className="mt-1.5 text-[16px] font-extrabold leading-snug text-ink">
        {pick(item.q, locale)}
      </h3>
      <div className="mt-3 grid gap-2">
        {item.options.map((option, optionIndex) => (
          <button
            key={option.en}
            type="button"
            disabled={picked !== null}
            onClick={() => {
              setPicked(optionIndex);
              if (optionIndex === item.answer) {
                setScore((value) => value + 1);
                sound("win");
              } else {
                sound("lose");
              }
            }}
            className={cn(
              "flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-start text-[12.5px] font-semibold transition",
              picked === null && "border-line bg-white/[0.03] hover:border-brand-400/50",
              picked !== null && optionIndex === item.answer && "border-accent/60 bg-accent/10 text-accent",
              picked === optionIndex && optionIndex !== item.answer && "border-red-400/50 bg-red-500/10 text-red-300",
              picked !== null && optionIndex !== item.answer && picked !== optionIndex && "border-line text-ink/30",
            )}
          >
            {pick(option, locale)}
            {picked !== null && optionIndex === item.answer ? <Check className="h-4 w-4" /> : null}
            {picked === optionIndex && optionIndex !== item.answer ? <X className="h-4 w-4" /> : null}
          </button>
        ))}
      </div>
      {picked !== null ? (
        <div className="mt-3">
          <p className="rounded-xl border border-brand-400/25 bg-brand-500/[0.07] p-3 text-[11.5px] leading-relaxed text-ink/60">
            {pick(item.explain, locale)}
          </p>
          <button
            type="button"
            onClick={() => {
              if (index + 1 >= marketingQuiz.length) {
                setDone(true);
                complete("quiz", meta.xp, pick(meta.title, locale));
              } else {
                setIndex(index + 1);
                setPicked(null);
              }
            }}
            className="btn-accent mt-3 w-full !py-2.5 text-[12.5px]"
          >
            {index + 1 >= marketingQuiz.length
              ? locale === "ar"
                ? "شوف النتيجة"
                : "See result"
              : locale === "ar"
                ? "السؤال التالي"
                : "Next question"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------------------------- Odd --------------------------------- */

function OddGame({ locale }: { locale: Locale }) {
  const { complete, sound } = useGame();
  const meta = useMeta("odd");
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const item = oddRounds[round];

  if (done) {
    return (
      <ResultCard
        title={locale === "ar" ? `${score} من ${oddRounds.length}` : `${score} of ${oddRounds.length}`}
        sub={locale === "ar" ? "عقلك بيلاحظ التفاصيل." : "Your brain catches the details."}
        xp={meta.xp}
        locale={locale}
      />
    );
  }

  return (
    <div>
      <Progress current={round} total={oddRounds.length} />
      <h3 className="mt-3 text-[15px] font-extrabold text-ink">
        {locale === "ar" ? "اختار الكلمة الغريبة" : "Pick the odd one out"}
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {item.words[locale].map((word, index) => (
          <button
            key={word}
            type="button"
            disabled={picked !== null}
            onClick={() => {
              setPicked(index);
              if (index === item.answer) {
                setScore((value) => value + 1);
                sound("win");
              } else {
                sound("lose");
              }
            }}
            className={cn(
              "rounded-xl border px-2 py-3.5 text-[13px] font-bold transition",
              picked === null && "border-line bg-white/[0.03] hover:border-brand-400/50",
              picked !== null && index === item.answer && "border-accent/60 bg-accent/10 text-accent",
              picked === index && index !== item.answer && "border-red-400/50 bg-red-500/10 text-red-300",
              picked !== null && index !== item.answer && picked !== index && "border-line text-ink/30",
            )}
          >
            {word}
          </button>
        ))}
      </div>
      {picked !== null ? (
        <div className="mt-3">
          <p className="rounded-xl border border-line bg-white/[0.02] p-3 text-[11.5px] text-ink/55">
            {pick(item.explain, locale)}
          </p>
          <button
            type="button"
            onClick={() => {
              if (round + 1 >= oddRounds.length) {
                setDone(true);
                complete("odd", meta.xp, pick(meta.title, locale));
              } else {
                setRound(round + 1);
                setPicked(null);
              }
            }}
            className="btn-accent mt-3 w-full !py-2.5 text-[12.5px]"
          >
            {round + 1 >= oddRounds.length
              ? locale === "ar"
                ? "شوف النتيجة"
                : "See result"
              : locale === "ar"
                ? "الجولة التالية"
                : "Next round"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------------------------- Spot -------------------------------- */

const SPOT_DIFFS = [5, 12, 19];

function spotPalette() {
  const hues = ["#2391FF", "#3FB6FF", "#7CC6FF", "#1B4B7A", "#2E6BA8"];
  return Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => hues[(row * 2 + col * 3) % hues.length]),
  );
}

function SpotGame({ locale }: { locale: Locale }) {
  const { complete, sound } = useGame();
  const meta = useMeta("spot");
  const [base] = useState(spotPalette);
  const [found, setFound] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const won = found.length === SPOT_DIFFS.length;

  useEffect(() => {
    if (!won) return;
    complete("spot", meta.xp, pick(meta.title, locale));
    sound("win");
  }, [won, complete, meta, locale, sound]);

  const cells = base.flat();
  const diffColor = (index: number) =>
    ["#FFF83F", "#FFA63F", "#8F6BFF"][SPOT_DIFFS.indexOf(index) % 3];

  const click = (index: number) => {
    if (won) return;
    if (SPOT_DIFFS.includes(index)) {
      if (!found.includes(index)) {
        setFound((prev) => [...prev, index]);
        sound("pop");
      }
    } else {
      setWrong(index);
      sound("error");
      window.setTimeout(() => setWrong(null), 380);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-[11.5px] text-ink/45">
        <span>
          {locale === "ar" ? "الشبكة اليسرى هي الأصل، واليمنى فيها الفروق." : "Left grid is the original; the right has changes."}
        </span>
        <span className="font-bold text-accent">
          {found.length}/{SPOT_DIFFS.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[false, true].map((isTarget) => (
          <div key={String(isTarget)} className="grid grid-cols-5 gap-1 rounded-xl border border-line bg-white/[0.02] p-2">
            {cells.map((color, index) => {
              const changed = isTarget && SPOT_DIFFS.includes(index);
              const isFound = found.includes(index);
              return (
                <button
                  key={`${isTarget}-${index}`}
                  type="button"
                  aria-label={locale === "ar" ? `خلية ${index + 1}` : `Cell ${index + 1}`}
                  onClick={() => isTarget && click(index)}
                  disabled={!isTarget}
                  className={cn(
                    "aspect-square rounded-[5px] transition",
                    wrong === index && isTarget && "ring-2 ring-red-400",
                    isFound && "ring-2 ring-accent",
                    isTarget && !won && "cursor-crosshair",
                  )}
                  style={{ backgroundColor: changed ? diffColor(index) : color }}
                />
              );
            })}
          </div>
        ))}
      </div>
      {won ? (
        <div className="mt-4">
          <ResultCard
            title={locale === "ar" ? "لقيت الثلاثة!" : "All three found!"}
            sub={locale === "ar" ? "عين الصقر. حرفيًا." : "Eagle eye. Literally."}
            xp={meta.xp}
            locale={locale}
          />
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------- Target ------------------------------- */

function TargetGame({ locale }: { locale: Locale }) {
  const { complete, sound } = useGame();
  const meta = useMeta("target");
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [cell, setCell] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    const tick = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(tick);
          setRunning(false);
          setDone(true);
          setCell(null);
          complete("target", meta.xp, pick(meta.title, locale));
          sound("win");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [running, complete, meta, locale, sound]);

  useEffect(() => {
    if (!running) return;
    const spawn = window.setInterval(() => {
      setCell(Math.floor(Math.random() * 25));
    }, 780);
    return () => window.clearInterval(spawn);
  }, [running]);

  const start = () => {
    setHits(0);
    setMisses(0);
    setTimeLeft(15);
    setDone(false);
    setRunning(true);
    setCell(Math.floor(Math.random() * 25));
    sound("click");
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-[11.5px] font-bold text-ink/50">
        <span className="inline-flex items-center gap-1.5">
          <Timer className="h-3.5 w-3.5" /> {timeLeft}s
        </span>
        <span>
          {locale === "ar" ? "إصابات" : "Hits"}: <b className="text-accent">{hits}</b> ·{" "}
          {locale === "ar" ? "أخطاء" : "Misses"}: <b className="text-ink/60">{misses}</b>
        </span>
      </div>
      <div className="relative grid grid-cols-5 gap-1.5 rounded-2xl border border-line bg-white/[0.02] p-2">
        {Array.from({ length: 25 }).map((_, index) => (
          <button
            key={index}
            type="button"
            disabled={!running}
            onClick={() => {
              if (index === cell) {
                setHits((value) => value + 1);
                sound("pop");
                setCell(null);
              } else {
                setMisses((value) => value + 1);
                sound("error");
              }
            }}
            aria-label={locale === "ar" ? `هدف ${index + 1}` : `Target ${index + 1}`}
            className="relative flex aspect-square items-center justify-center rounded-lg border border-white/5 bg-white/[0.02]"
          >
            {cell === index ? (
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-3/4 w-3/4 items-center justify-center rounded-full bg-accent text-onAccent"
              >
                <Target className="h-4 w-4" />
              </motion.span>
            ) : null}
          </button>
        ))}
        {!running ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-abyss/85 backdrop-blur-sm">
            {done ? (
              <p className="text-center text-[14px] font-black text-ink">
                {locale === "ar" ? `${hits} إصابة في 15 ثانية` : `${hits} hits in 15s`}
                <span className="mt-1 block text-[11px] font-semibold text-ink/45">
                  {locale === "ar" ? "دقة مش بطالة." : "Not bad accuracy."}
                </span>
              </p>
            ) : null}
            <button type="button" onClick={start} className="btn-accent !px-5 !py-2.5 text-[12.5px]">
              {done
                ? locale === "ar"
                  ? "العن من جديد"
                  : "Play again"
                : locale === "ar"
                  ? "ابدأ التحدي"
                  : "Start challenge"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* --------------------------------- Wheel -------------------------------- */

function WheelGame({ locale }: { locale: Locale }) {
  const { complete, sound } = useGame();
  const meta = useMeta("wheel");
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const count = wheelSegments.length;
  const slice = 360 / count;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    sound("spin");
    const index = Math.floor(Math.random() * count);
    const target = 1440 + (360 - index * slice - slice / 2);
    setAngle((prev) => prev + target);
    window.setTimeout(() => {
      setSpinning(false);
      setResult(index);
      complete("wheel", meta.xp, pick(meta.title, locale));
      sound("win");
    }, 1900);
  };

  return (
    <div className="text-center">
      <div className="relative mx-auto h-56 w-56">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 text-accent">
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path d="M12 22L2 4h20L12 22Z" fill="currentColor" />
          </svg>
        </div>
        <motion.div
          animate={{ rotate: angle }}
          transition={{ duration: 1.85, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full rounded-full border-4 border-white/10 shadow-[0_0_50px_-14px_rgba(35,145,255,0.8)]"
          style={{
            background: `conic-gradient(${Array.from({ length: count })
              .map((_, index) => {
                const from = index * slice;
                const to = from + slice;
                const color = index % 2 === 0 ? "#2391FF" : index % 4 === 1 ? "#FFF83F" : "#0B1B2F";
                return `${color} ${from}deg ${to}deg`;
              })
              .join(", ")})`,
          }}
        >
          <div className="relative h-full w-full">
            {wheelSegments.map((segment, index) => (
              <span
                key={segment.en}
                className="absolute left-1/2 top-1/2 origin-left text-[9px] font-black text-white"
                style={{
                  transform: `rotate(${index * slice + slice / 2}deg) translateX(40px)`,
                  maxWidth: 70,
                }}
              >
                {pick(segment, locale)}
              </span>
            ))}
          </div>
        </motion.div>
        <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-abyss bg-surface text-[10px] font-black text-accent">
          SPIN
        </div>
      </div>
      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="btn-accent mt-5 !px-6 !py-2.5 text-[13px] disabled:opacity-50"
      >
        {spinning
          ? locale === "ar"
            ? "بتلف…"
            : "Spinning…"
          : locale === "ar"
            ? "لف العجلة"
            : "Spin the wheel"}
      </button>
      {result !== null ? (
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40">
            {locale === "ar" ? "جائزتك" : "Your prize"}
          </p>
          <p className="mt-1 text-[18px] font-black text-accent">
            {pick(wheelSegments[result], locale)}
          </p>
          <p className="mt-1 text-[11px] text-ink/35">
            {locale === "ar"
              ? "الجوائز رمزية ومزاح فقط — القيمة الحقيقية إنك وصلت لهنا."
              : "Prizes are symbolic jokes only — the real value is getting here."}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------ Personality ----------------------------- */

function PersonalityGame({ locale }: { locale: Locale }) {
  const { complete, sound } = useGame();
  const meta = useMeta("personality");
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Record<PersonaKey, number>>({
    strategist: 0,
    maker: 0,
    hype: 0,
    calm: 0,
  });
  const [result, setResult] = useState<PersonaKey | null>(null);
  const question = personalityGame.questions[index];

  if (result) {
    const info = personalityGame.results[result];
    return (
      <div>
        <ResultCard
          title={pick(info.title, locale)}
          sub={pick(info.desc, locale)}
          xp={meta.xp}
          locale={locale}
          onReplay={() => {
            setScores({ strategist: 0, maker: 0, hype: 0, calm: 0 });
            setIndex(0);
            setResult(null);
          }}
        />
        <p className="mt-3 text-center text-[10.5px] text-ink/30">
          {locale === "ar"
            ? "اختبار ترفيهي فقط — مش تحليل نفسي حقيقي."
            : "Entertainment only — not a real psychological assessment."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Progress current={index} total={personalityGame.questions.length} />
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">
        {locale === "ar"
          ? `سؤال ${index + 1} من ${personalityGame.questions.length}`
          : `Question ${index + 1} of ${personalityGame.questions.length}`}
      </p>
      <h3 className="mt-1.5 text-[16px] font-extrabold leading-snug text-ink">
        {pick(question.q, locale)}
      </h3>
      <div className="mt-3 grid gap-2">
        {question.options.map((option) => (
          <button
            key={option.key + option.en}
            type="button"
            onClick={() => {
              sound("click");
              const nextScores = { ...scores, [option.key]: scores[option.key] + 1 };
              setScores(nextScores);
              if (index + 1 >= personalityGame.questions.length) {
                const winner = (Object.keys(nextScores) as PersonaKey[]).reduce((a, b) =>
                  nextScores[b] > nextScores[a] ? b : a,
                );
                setResult(winner);
                complete("personality", meta.xp, pick(meta.title, locale));
              } else {
                setIndex(index + 1);
              }
            }}
            className="option-card text-start text-[12.5px]"
          >
            {pick(option, locale)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- WYR --------------------------------- */

function WyrGame({ locale }: { locale: Locale }) {
  const { complete, sound } = useGame();
  const meta = useMeta("wyr");
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<"left" | "right" | null>(null);
  const [done, setDone] = useState(false);
  const round = wyrRounds[index];

  if (done) {
    return (
      <ResultCard
        title={locale === "ar" ? "خلصت الاختيارات الصعبة" : "You survived the hard choices"}
        sub={
          locale === "ar"
            ? "كل الاختيارات كانت مزاح… مفيش إجابة غلط، بس فيه إجابات بتضحك أكتر."
            : "All choices were jokes… no wrong answers, just funnier ones."
        }
        xp={meta.xp}
        locale={locale}
      />
    );
  }

  return (
    <div>
      <Progress current={index} total={wyrRounds.length} />
      <p className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-ink/35">
        {locale === "ar" ? "تختار إيه؟" : "Which one?"}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {(["left", "right"] as const).map((side) => (
          <button
            key={side}
            type="button"
            disabled={choice !== null}
            onClick={() => {
              setChoice(side);
              sound("click");
            }}
            className={cn(
              "rounded-xl border px-3 py-4 text-start text-[12.5px] font-bold leading-relaxed transition",
              choice === side
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-line bg-white/[0.03] text-ink/75 hover:border-brand-400/50",
            )}
          >
            {pick(side === "left" ? round.left : round.right, locale)}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {choice !== null ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mt-3 rounded-xl border border-brand-400/25 bg-brand-500/[0.06] p-3 text-[11.5px] leading-relaxed text-ink/60">
              {pick(choice === "left" ? round.commentLeft : round.commentRight, locale)}
            </p>
            <button
              type="button"
              onClick={() => {
                if (index + 1 >= wyrRounds.length) {
                  setDone(true);
                  complete("wyr", meta.xp, pick(meta.title, locale));
                } else {
                  setIndex(index + 1);
                  setChoice(null);
                }
              }}
              className="btn-accent mt-3 w-full !py-2.5 text-[12.5px]"
            >
              {index + 1 >= wyrRounds.length
                ? locale === "ar"
                  ? "شوف النتيجة"
                  : "See result"
                : locale === "ar"
                  ? "الموقف التالي"
                  : "Next dilemma"}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
