"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Zap } from "lucide-react";
import { getLevel } from "@/lib/game";
import { playSound } from "@/lib/sound";

const STORAGE_KEY = "rawaj-game-v1";

export type CampaignReport = {
  strengthKeys: string[];
  serviceSlug: string;
};

export type CampaignProgress = {
  stage: number;
  view: number;
  brandName: string;
  palette: string[];
  strategy: string[];
  calendar: Record<string, string>;
  budget: { meta: number; tiktok: number; google: number };
  engagement: number;
  reach: number;
  clicks: number;
  sales: number;
  report: CampaignReport | null;
  bossDone: boolean;
  replayWatched: string[];
  teamOpened: string[];
};

export type GameData = {
  xp: number;
  coins: number;
  completed: string[];
  trapsSeen: string[];
  soundOn: boolean;
  motionOn: boolean;
  trapsOn: boolean;
  introHidden: boolean;
  simpleMode: boolean;
  name?: string;
  campaign: CampaignProgress;
};

export const campaignDefaults: CampaignProgress = {
  stage: 0,
  view: 0,
  brandName: "",
  palette: [],
  strategy: [],
  calendar: {},
  budget: { meta: 0, tiktok: 0, google: 0 },
  engagement: 0,
  reach: 0,
  clicks: 0,
  sales: 0,
  report: null,
  bossDone: false,
  replayWatched: [],
  teamOpened: [],
};

const defaults: GameData = {
  xp: 0,
  coins: 0,
  completed: [],
  trapsSeen: [],
  soundOn: false,
  motionOn: true,
  trapsOn: true,
  introHidden: false,
  simpleMode: false,
  campaign: campaignDefaults,
};

type Toast = { id: number; title: string; sub?: string; tone: "xp" | "level" | "info" };

type GameContextValue = {
  data: GameData;
  level: ReturnType<typeof getLevel>;
  hydrated: boolean;
  addXp: (amount: number, reason?: string) => void;
  complete: (id: string, xp: number, label: string) => void;
  markTrap: (id: string) => void;
  toggleSound: () => void;
  toggleMotion: () => void;
  toggleTraps: () => void;
  toggleSimple: () => void;
  setCampaign: (patch: Partial<CampaignProgress>) => void;
  setView: (index: number) => void;
  unlockStage: (index: number) => void;
  finishStage: (payload: {
    stage: number;
    xp: number;
    coins: number;
    label: string;
    patch?: Partial<CampaignProgress>;
  }) => void;
  grantCampaignXp: (xp: number, label: string, patch?: Partial<CampaignProgress>) => void;
  hideIntro: (forever?: boolean) => void;
  reset: () => void;
  sound: (name: Parameters<typeof playSound>[0]) => void;
  toast: (title: string, sub?: string, tone?: Toast["tone"]) => void;
  triggerGlitch: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GameData>(defaults);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<GameData>;
        const campaign = parsed.campaign;
        setData({
          ...defaults,
          ...parsed,
          xp: Number.isFinite(parsed.xp) ? Math.max(0, Number(parsed.xp)) : 0,
          coins: Number.isFinite(parsed.coins) ? Math.max(0, Number(parsed.coins)) : 0,
          completed: Array.isArray(parsed.completed) ? parsed.completed : [],
          trapsSeen: Array.isArray(parsed.trapsSeen) ? parsed.trapsSeen : [],
          campaign: campaign
            ? {
                ...campaignDefaults,
                ...campaign,
                budget: { ...campaignDefaults.budget, ...(campaign.budget ?? {}) },
                palette: Array.isArray(campaign.palette) ? campaign.palette : [],
                strategy: Array.isArray(campaign.strategy) ? campaign.strategy : [],
                calendar:
                  campaign.calendar && typeof campaign.calendar === "object"
                    ? campaign.calendar
                    : {},
                replayWatched: Array.isArray(campaign.replayWatched) ? campaign.replayWatched : [],
                teamOpened: Array.isArray(campaign.teamOpened) ? campaign.teamOpened : [],
              }
            : campaignDefaults,
        });
      }
    } catch {
      /* التخزين المحلي غير متاح — نكمل بدون حفظ */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* تجاهل */
    }
  }, [data, hydrated]);

  const pushToast = useCallback((title: string, sub?: string, tone: Toast["tone"] = "info") => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((list) => [...list.slice(-1), { id, title, sub, tone }]);
    window.setTimeout(() => {
      setToasts((list) => list.filter((item) => item.id !== id));
    }, 3400);
  }, []);

  const sound = useCallback(
    (name: Parameters<typeof playSound>[0]) => {
      playSound(name, data.soundOn);
    },
    [data.soundOn],
  );

  const addXp = useCallback(
    (amount: number, reason?: string) => {
      if (amount <= 0) return;
      setData((prev) => {
        const before = getLevel(prev.xp);
        const nextXp = prev.xp + amount;
        const after = getLevel(nextXp);
        if (after.index > before.index) {
          pushToast(
            `${after.current.code} — ${after.current.label.ar}`,
            "وصلت لمستوى جديد!",
            "level",
          );
          playSound("level", prev.soundOn);
        } else {
          pushToast(`+${amount} XP`, reason ?? "نقطة جديدة", "xp");
          playSound("win", prev.soundOn);
        }
        return { ...prev, xp: nextXp };
      });
    },
    [pushToast],
  );

  const complete = useCallback(
    (id: string, xp: number, label: string) => {
      setData((prev) => {
        const already = prev.completed.includes(id);
        const grant = already ? 5 : xp;
        const nextXp = prev.xp + grant;
        const before = getLevel(prev.xp);
        const after = getLevel(nextXp);
        if (after.index > before.index) {
          pushToast(`${after.current.code} — ${after.current.label.ar}`, "مستوى جديد! خدها بجد.", "level");
          playSound("level", prev.soundOn);
        } else {
          pushToast(`+${grant} XP`, label, "xp");
          playSound("win", prev.soundOn);
        }
        return {
          ...prev,
          xp: nextXp,
          coins: prev.coins + Math.round(grant / 2),
          completed: already ? prev.completed : [...prev.completed, id],
        };
      });
    },
    [pushToast],
  );

  const markTrap = useCallback((id: string) => {
    setData((prev) =>
      prev.trapsSeen.includes(id) ? prev : { ...prev, trapsSeen: [...prev.trapsSeen, id] },
    );
  }, []);

  const toggleSound = useCallback(() => {
    setData((prev) => {
      const next = !prev.soundOn;
      if (next) playSound("pop", true);
      return { ...prev, soundOn: next };
    });
  }, []);

  const toggleMotion = useCallback(() => {
    setData((prev) => ({ ...prev, motionOn: !prev.motionOn }));
  }, []);

  const toggleTraps = useCallback(() => {
    setData((prev) => ({ ...prev, trapsOn: !prev.trapsOn }));
  }, []);

  const toggleSimple = useCallback(() => {
    setData((prev) => ({ ...prev, simpleMode: !prev.simpleMode }));
  }, []);

  const setCampaign = useCallback((patch: Partial<CampaignProgress>) => {
    setData((prev) => ({ ...prev, campaign: { ...prev.campaign, ...patch } }));
  }, []);

  const setView = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      campaign: { ...prev.campaign, view: Math.max(0, Math.min(7, index)) },
    }));
  }, []);

  const unlockStage = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      campaign: {
        ...prev.campaign,
        stage: Math.max(prev.campaign.stage, Math.min(7, index)),
      },
    }));
  }, []);

  const finishStage = useCallback(
    ({ stage, xp, coins, label, patch }: {
      stage: number;
      xp: number;
      coins: number;
      label: string;
      patch?: Partial<CampaignProgress>;
    }) => {
      setData((prev) => {
        const before = getLevel(prev.xp);
        const nextXp = prev.xp + xp;
        const after = getLevel(nextXp);
        if (after.index > before.index) {
          pushToast(`${after.current.code} — ${after.current.label.ar}`, "مستوى جديد في الحملة!", "level");
          playSound("level", prev.soundOn);
        } else if (xp > 0 || coins > 0) {
          pushToast(`+${xp} XP${coins ? ` · +${coins}` : ""}`, label, "xp");
          playSound("win", prev.soundOn);
        }
        return {
          ...prev,
          xp: nextXp,
          coins: prev.coins + coins,
          campaign: {
            ...prev.campaign,
            ...patch,
            stage: Math.max(prev.campaign.stage, Math.min(7, stage + 1)),
          },
        };
      });
    },
    [pushToast],
  );

  const grantCampaignXp = useCallback(
    (xp: number, label: string, patch?: Partial<CampaignProgress>) => {
      if (xp <= 0 && !patch) return;
      setData((prev) => {
        const before = getLevel(prev.xp);
        const nextXp = prev.xp + Math.max(0, xp);
        const after = getLevel(nextXp);
        if (xp > 0) {
          if (after.index > before.index) {
            pushToast(`${after.current.code} — ${after.current.label.ar}`, "مستوى جديد في الحملة!", "level");
            playSound("level", prev.soundOn);
          } else {
            pushToast(`+${xp} XP`, label, "xp");
            playSound("win", prev.soundOn);
          }
        }
        return {
          ...prev,
          xp: nextXp,
          campaign: { ...prev.campaign, ...patch },
        };
      });
    },
    [pushToast],
  );

  const hideIntro = useCallback((forever = false) => {
    setData((prev) => (forever ? { ...prev, introHidden: true } : prev));
    try {
      window.sessionStorage.setItem("rawaj-intro-seen", "1");
      if (forever) window.localStorage.setItem("rawaj-intro-hidden", "1");
    } catch {
      /* تجاهل */
    }
  }, []);

  const reset = useCallback(() => {
    setData((prev) => ({
      ...defaults,
      soundOn: prev.soundOn,
      motionOn: prev.motionOn,
      trapsOn: prev.trapsOn,
      campaign: campaignDefaults,
    }));
    try {
      window.sessionStorage.removeItem("rawaj-intro-seen");
      window.localStorage.removeItem("rawaj-intro-hidden");
    } catch {
      /* تجاهل */
    }
    pushToast("تم تصفير التقدم", "نبدأ من المستوى الأول", "info");
  }, [pushToast]);

  const triggerGlitch = useCallback(() => {
    // This will be handled by GlitchEventProvider via its own state
    // Just a placeholder for potential future use
  }, []);

  const level = useMemo(() => getLevel(data.xp), [data.xp]);

  const value = useMemo<GameContextValue>(
    () => ({
      data,
      level,
      hydrated,
      addXp,
      complete,
      markTrap,
      toggleSound,
      toggleMotion,
      toggleTraps,
      toggleSimple,
      setCampaign,
      setView,
      unlockStage,
      finishStage,
      grantCampaignXp,
      hideIntro,
      reset,
      sound,
      toast: pushToast,
      triggerGlitch,
    }),
    [
      data,
      level,
      hydrated,
      addXp,
      complete,
      markTrap,
      toggleSound,
      toggleMotion,
      toggleTraps,
      toggleSimple,
      setCampaign,
      setView,
      unlockStage,
      finishStage,
      grantCampaignXp,
      hideIntro,
      reset,
      sound,
      pushToast,
      triggerGlitch,
    ],
  );

  return (
    <GameContext.Provider value={value}>
      <MotionConfig reducedMotion={data.motionOn ? "never" : "always"}>
        {children}
      </MotionConfig>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-3 z-[90] flex flex-col items-center gap-2 px-4">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={
              item.tone === "level"
                ? "pointer-events-auto flex items-center gap-3 border-4 border-[#FFF83F] bg-[#050D1A] px-4 py-3"
                : "pointer-events-auto flex items-center gap-3 border-4 border-[#2391FF] bg-[#050D1A] px-4 py-2.5"
            }
            style={{ boxShadow: "4px 4px 0 0 #040B14" }}
          >
            <span className={item.tone === "level" ? "inline-flex h-8 w-8 items-center justify-center border-2 border-[#040B14] bg-[#FFF83F] text-[#040B14]" : "inline-flex h-8 w-8 items-center justify-center border-2 border-[#2391FF] bg-[#0A2647] text-[#7CC6FF]"}>
              <Zap className="h-4 w-4" />
            </span>
            <span className="text-start">
              <span className="block text-[13px] font-black text-ink">{item.title}</span>
              {item.sub ? <span className="block text-[11.5px] text-ink/60">{item.sub}</span> : null}
            </span>
          </div>
        ))}
      </div>
    </GameContext.Provider>
  );
}
