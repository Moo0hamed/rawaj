import type { Localized } from "./i18n";

export type Level = {
  min: number;
  label: Localized;
  code: string;
};

export const LEVELS: Level[] = [
  { min: 0, label: { ar: "مبتدئ", en: "Beginner" }, code: "BEGINNER" },
  { min: 180, label: { ar: "مستكشف", en: "Explorer" }, code: "EXPLORER" },
  { min: 420, label: { ar: "أسطورة رَواج", en: "RAWAJ Legend" }, code: "RAWAJ LEGEND" },
];

export type LevelInfo = {
  index: number;
  current: Level;
  next: Level | null;
  progress: number;
  remaining: number;
};

export function getLevel(xp: number): LevelInfo {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (xp >= LEVELS[i].min) index = i;
  }
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const span = next ? next.min - current.min : 1;
  const progress = next ? Math.min(1, (xp - current.min) / span) : 1;
  const remaining = next ? Math.max(0, next.min - xp) : 0;
  return { index, current, next, progress, remaining };
}

export const XP_ACTIONS = {
  game: 35,
  trap: 20,
  perfect: 20,
  explore: 5,
} as const;
