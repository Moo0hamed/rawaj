"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  Clapperboard,
  Coins,
  Compass,
  Lock,
  Megaphone,
  Palette,
  Rocket,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useGame } from "@/components/game/GameProvider";
import { Modal } from "@/components/game/Modal";
import { stages } from "@/content/campaign";
import { pick, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const stageIcons = [Palette, Compass, CalendarDays, Megaphone, Clapperboard, Users, Rocket, Swords];

export function CampaignHUD({ locale }: { locale: Locale }) {
  const { data, level, hydrated, toggleSound, toggleMotion, toggleTraps, toggleSimple, reset, setView, unlockStage } =
    useGame();
  const [settings, setSettings] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const inCampaign = pathname === `/${locale}` || pathname === `/${locale}/campaign`;

  useEffect(() => {
    setMapOpen(false);
  }, [pathname]);

  if (!hydrated) return null;

  const go = (index: number) => {
    if (data.campaign.stage < index) unlockStage(index);
    setView(index);
    setMapOpen(false);
    const hash = index === 7 ? "#boss" : "";
    if (!inCampaign) {
      router.push(`/${locale}/campaign${hash}`);
    } else {
      if (hash) window.history.replaceState(null, "", `/${locale}/campaign#boss`);
      window.setTimeout(() => {
        const target = hash ? document.getElementById("boss") : null;
        if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
        else window.scrollTo({ top: 0, behavior: "auto" });
      }, 40);
    }
  };

  const nodes = (
    <ol className="flex min-w-max items-center gap-1">
      {stages.map((stage, index) => {
        const done = index < data.campaign.stage;
        const active = index === data.campaign.view;
        const locked = index > data.campaign.stage;
        const Icon = stageIcons[index];
        return (
          <li key={stage.id} className="flex items-center">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "mx-0.5 hidden h-[4px] w-3 sm:block",
                  done || active ? "bg-[#FFF83F]" : "bg-[#1A2D45]",
                )}
                style={{ imageRendering: "pixelated" }}
              />
            ) : null}
            <button
              type="button"
              onClick={() => go(index)}
              aria-current={active ? "step" : undefined}
              aria-label={`${pick(stage.title, locale)}${locked ? (locale === "ar" ? " — مقفولة، اضغط للتخطي" : " — locked, click to skip") : ""}`}
              title={pick(stage.title, locale)}
              className={cn(
                "group relative flex h-11 w-11 flex-col items-center justify-center border-2 text-[9px] font-black",
                active
                  ? "border-[#040B14] bg-[#FFF83F] text-[#040B14]"
                  : done
                    ? "border-[#2391FF] bg-[#0A2647] text-[#7CC6FF]"
                    : "border-[#1A2D45] bg-[#050D1A] text-ink/40 hover:border-[#2391FF] hover:text-[#FFF83F]",
              )}
              style={{ boxShadow: active ? "3px 3px 0 0 #040B14" : "2px 2px 0 0 #040B14" }}
            >
              {done ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-3.5 w-3.5" /> : <Icon className="h-4 w-4" />}
              <span className="mt-0.5 font-pixel text-[7px] leading-none">{index === 7 ? "BOSS" : `0${index + 1}`}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <div data-hud="true" className="campaign-hud safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-[80] px-2 pb-2 sm:px-4 sm:pb-3">
        <div
          className="pointer-events-auto mx-auto flex max-w-5xl items-center gap-2 border-4 border-[#2391FF] bg-[#050D1A] px-2 py-2 sm:gap-4 sm:px-4"
          style={{ boxShadow: "0 -4px 0 0 #040B14, 6px 6px 0 0 #040B14" }}
        >
          <button
            type="button"
            onClick={() => setSettings(true)}
            aria-label={locale === "ar" ? "ملف اللاعب والإعدادات" : "Player profile and settings"}
            className="flex shrink-0 items-center gap-2 px-1.5 py-1 text-start hover:bg-[#0A1626]"
          >
            <span className="relative inline-flex h-9 w-9 items-center justify-center border-2 border-[#2391FF] bg-[#0A2647] text-[#FFF83F]">
              <Trophy className="h-4 w-4" />
              <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center border border-[#040B14] bg-[#FFF83F] px-1 text-[8.5px] font-black text-[#040B14]">
                {level.index + 1}
              </span>
            </span>
            <span className="hidden sm:block">
              <span className="block font-pixel text-[7px] text-[#7CC6FF]">{level.current.code}</span>
              <span className="block text-[10px] font-bold text-ink/70">{pick(level.current.label, locale)}</span>
              <span className="mt-1 flex h-3 w-20 overflow-hidden border-2 border-[#1A2D45] bg-[#040B14] p-[2px]">
                <span className="block h-full bg-[#2391FF]" style={{ width: `${Math.max(5, level.progress * 100)}%` }} />
              </span>
            </span>
          </button>

          <div className="hidden min-w-0 flex-1 justify-center md:flex">{nodes}</div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1 border-2 border-[#C7BA00] bg-[#1a1600] px-2 py-1.5 text-[10.5px] font-black text-[#FFF83F]">
              <Coins className="h-3.5 w-3.5" />{data.coins}
            </span>
            <span className="inline-flex items-center gap-1 border-2 border-[#2391FF] bg-[#08182c] px-2 py-1.5 text-[10.5px] font-black text-[#7CC6FF]">
              <Sparkles className="h-3.5 w-3.5" />{data.xp} XP
            </span>
            <button type="button" onClick={() => setMapOpen(true)} className="inline-flex h-9 w-9 items-center justify-center border-2 border-[#1A2D45] bg-[#0A1626] text-ink/70 hover:border-[#FFF83F] hover:text-[#FFF83F] md:hidden" aria-label={locale === "ar" ? "خريطة المراحل" : "Stage map"}>
              <Compass className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setSettings(true)} className="inline-flex h-9 w-9 items-center justify-center border-2 border-[#1A2D45] bg-[#0A1626] text-ink/70 hover:border-[#FFF83F] hover:text-[#FFF83F]" aria-label={locale === "ar" ? "الإعدادات" : "Settings"}>
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {mapOpen ? (
        <div className="fixed inset-0 z-[85] flex items-end bg-[#03080F]/90 md:hidden" onClick={() => setMapOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="safe-bottom w-full border-t-4 border-[#2391FF] bg-[#050D1A] p-4 pb-24">
            <p className="pixel-label mb-3">{locale === "ar" ? "خريطة المراحل" : "STAGE MAP"}</p>
            <div className="overflow-x-auto pb-1">{nodes}</div>
            <p className="mt-3 text-[11px] text-ink/40">{locale === "ar" ? "المراحل بتتفتح بالترتيب، وأي مرحلة مقفولة تقدر تتخطاها بضغطة." : "Stages unlock in order; any locked stage can be skipped with one tap."}</p>
          </div>
        </div>
      ) : null}

      <Modal
        open={settings}
        onClose={() => { setSettings(false); setConfirmReset(false); }}
        title={locale === "ar" ? "ملف اللاعب" : "Player profile"}
        eyebrow="PLAYER STATS"
      >
        <div className="flex items-center justify-between gap-4 border-4 border-[#1A2D45] bg-[#081425] p-4">
          <div>
            <p className="pixel-label">{level.current.code}</p>
            <p className="mt-1 text-[20px] font-black text-ink">{pick(level.current.label, locale)}</p>
            <p className="mt-1 text-[12px] text-ink/60">
              {level.next ? (locale === "ar" ? `باقي ${level.remaining} XP للمستوى التالي` : `${level.remaining} XP to the next level`) : (locale === "ar" ? "وصلت لأعلى مستوى في رَواج" : "Top RAWAJ level reached")}
            </p>
          </div>
          <div className="text-end">
            <p className="text-[26px] font-black leading-none text-[#FFF83F]">{data.xp}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/40">XP</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#7CC6FF]"><Coins className="h-3 w-3" /> {data.coins}</p>
          </div>
        </div>

        <div className="mt-3 flex h-4 overflow-hidden border-2 border-[#1A2D45] bg-[#040B14] p-[2px]">
          <div className="h-full bg-[#2391FF]" style={{ width: `${Math.max(5, level.progress * 100)}%` }} />
        </div>

        <div className="mt-5 grid gap-2">
          <button type="button" onClick={toggleSound} className="flex items-center justify-between border-2 border-[#1A2D45] bg-[#081425] px-3.5 py-3 text-[13px] font-semibold hover:border-[#2391FF]">
            <span className="flex items-center gap-2">{data.soundOn ? <Volume2 className="h-4 w-4 text-[#2391FF]" /> : <VolumeX className="h-4 w-4 text-ink/40" />}{locale === "ar" ? "أصوات اللعبة" : "Game sounds"}</span>
            <Toggle on={data.soundOn} />
          </button>
          <button type="button" onClick={toggleMotion} className="flex items-center justify-between border-2 border-[#1A2D45] bg-[#081425] px-3.5 py-3 text-[13px] font-semibold hover:border-[#2391FF]">
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#2391FF]" />{locale === "ar" ? "الحركات والانتقالات" : "Motion & transitions"}</span>
            <Toggle on={data.motionOn} />
          </button>
          <button type="button" onClick={toggleTraps} className="flex items-center justify-between border-2 border-[#1A2D45] bg-[#081425] px-3.5 py-3 text-[13px] font-semibold hover:border-[#2391FF]">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#2391FF]" />{locale === "ar" ? "مقالب خفيفة" : "Light pranks"}</span>
            <Toggle on={data.trapsOn} />
          </button>
          <button type="button" onClick={toggleSimple} className="flex items-center justify-between border-2 border-[#1A2D45] bg-[#081425] px-3.5 py-3 text-[13px] font-semibold hover:border-[#2391FF]">
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#2391FF]" />{locale === "ar" ? "الوضع البسيط (بدون خلفيات متحركة)" : "Simple mode (no animated backgrounds)"}</span>
            <Toggle on={data.simpleMode} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link href={`/${locale}/services`} className="border-2 border-[#1A2D45] bg-[#081425] px-3 py-2.5 text-center text-[12px] font-bold text-ink/70 hover:border-[#2391FF] hover:text-ink">{locale === "ar" ? "الخدمات" : "Services"}</Link>
          <Link href={`/${locale}/work`} className="border-2 border-[#1A2D45] bg-[#081425] px-3 py-2.5 text-center text-[12px] font-bold text-ink/70 hover:border-[#2391FF] hover:text-ink">{locale === "ar" ? "المهمات" : "Missions"}</Link>
          <Link href={`/${locale}/team`} className="border-2 border-[#1A2D45] bg-[#081425] px-3 py-2.5 text-center text-[12px] font-bold text-ink/70 hover:border-[#2391FF] hover:text-ink">{locale === "ar" ? "الفريق" : "Team"}</Link>
          <Link href={`/${locale}/contact`} className="border-2 border-[#1A2D45] bg-[#081425] px-3 py-2.5 text-center text-[12px] font-bold text-ink/70 hover:border-[#2391FF] hover:text-ink">{locale === "ar" ? "تواصل" : "Contact"}</Link>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Link href={`/${locale}/campaign`} className="btn-accent !px-4 !py-2 text-[12px]">{locale === "ar" ? "ارجع للحملة" : "Back to campaign"}</Link>
          {confirmReset ? (
            <button type="button" onClick={() => { reset(); setConfirmReset(false); }} className="border-2 border-red-400 bg-red-900/40 px-3 py-2 text-[11.5px] font-bold text-red-200">{locale === "ar" ? "تأكيد التصفير" : "Confirm reset"}</button>
          ) : (
            <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink/40 hover:text-ink/80"><RotateCcw className="h-3.5 w-3.5" />{locale === "ar" ? "تصفير الحملة" : "Reset campaign"}</button>
          )}
        </div>

        <p className="mt-3 text-[10.5px] leading-relaxed text-ink/35">{locale === "ar" ? "كل تقدمك محفوظ على جهازك فقط (LocalStorage) ولا يُرسل لأي خادم." : "All progress is stored on your device only (LocalStorage) and never sent to a server."}</p>
      </Modal>
    </>
  );
}

function Toggle({ on }: { on: boolean }) {
  return <span className={cn("border-2 px-2 py-0.5 text-[10px] font-black uppercase", on ? "border-[#040B14] bg-[#FFF83F] text-[#040B14]" : "border-[#1A2D45] bg-[#040B14] text-ink/50")}>{on ? "ON" : "OFF"}</span>;
}