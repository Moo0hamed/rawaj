"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useGame } from "@/components/game/GameProvider";
import { mascotByIdle, mascotLines } from "@/content/campaign";
import { MascotSprite, moodFromIndex } from "@/components/theme/MascotSprite";
import { themeForStage, THEMES, type ThemeId } from "@/lib/themes";
import { pick, type Locale } from "@/lib/i18n";

const KEY = "rawaj-mascot-off";

export function Mascot({ locale }: { locale: Locale }) {
  const { data, hydrated } = useGame();
  const [dismissed, setDismissed] = useState(true);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let off = false;
    try { off = window.sessionStorage.getItem(KEY) === "1"; } catch {}
    if (off) return;
    setDismissed(false);
    const timer = window.setTimeout(() => setVisible(true), 6500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => { if (!dismissed) setIndex(0); }, [data.campaign.view, dismissed]);
  useEffect(() => {
    if (dismissed) return;
    const loop = window.setInterval(() => setIndex((v) => v + 1), 30000);
    return () => window.clearInterval(loop);
  }, [dismissed]);

  const close = () => { setVisible(false); setDismissed(true); try { window.sessionStorage.setItem(KEY, "1"); } catch {} };
  if (!hydrated || dismissed || !visible) return null;

  const simple = Boolean((data as any).simpleMode) || !data.motionOn;
  const theme: ThemeId = simple ? "simple" : themeForStage(data.campaign.view);
  const stageLines = mascotLines[data.campaign.view] ?? [];
  const lines = [...stageLines, ...mascotByIdle];
  const line = lines[index % Math.max(1, lines.length)];
  const bubble = "pointer-events-auto relative max-w-[250px] p-3 pe-7 text-[12px] leading-relaxed";
  const themeBubble: Record<ThemeId,string> = {
    intro:"bg-[#F3E8D2] text-[#4A1218] border-4 border-[#2A080C]",
    home:"bg-[#050D1A] text-[#E9F1FF] border-4 border-[#2391FF]",
    strategy:"bg-[#141F33] text-[#EAF2FF] border-4 border-[#2391FF]",
    social:"bg-white text-[#10243B] border-4 border-[#10243B] rounded-2xl shadow-[4px_4px_0_#10243B]",
    ads:"bg-[#F3E8D2] text-[#12090B] border-4 border-[#12090B] rounded-xl",
    replay:"bg-[#EAFBFF] text-[#074B52] border-4 border-[#074B52] rounded-2xl",
    team:"bg-[#111111] text-[#F5EFE2] border border-[#CBBBA0]",
    launch:"bg-[#E4E9F2] text-[#24364D] rounded-2xl shadow-[6px_6px_12px_#C2CCD8,-6px_-6px_12px_#FFFFFF]",
    contact:"bg-[#0A1C38] text-[#EAF4FF] border-2 border-[#2391FF] shadow-[0_0_18px_rgba(35,145,255,.35)]",
    horror:"bg-[#1A1030] text-[#EBDDFF] border-2 border-[#7D5CFF]",
    admin:"bg-[#E4E9F2] text-[#24364D] rounded-xl shadow-[6px_6px_12px_#C2CCD8,-6px_-6px_12px_#FFFFFF]",
    simple:"bg-[#0A1626] text-[#E9F1FF] border border-[#2A3F58] rounded-lg",
  };

  return (
    <div className="pointer-events-none fixed bottom-20 start-3 z-[79] flex items-end gap-2 sm:bottom-24 sm:start-4">
      <span aria-hidden="true" className="pointer-events-none flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[#2391FF] bg-[#050D1A] shadow-[3px_3px_0_#040B14]">
        <MascotSprite theme={theme} mood={moodFromIndex(index)} className="h-9 w-9" />
      </span>
      <div className={`${bubble} ${themeBubble[theme]}`}>
        <button type="button" onClick={() => setIndex((v) => v + 1)} className="block text-start font-semibold">
          {pick(line, locale)}
        </button>
        <button type="button" onClick={close} aria-label={locale === "ar" ? "إغلاق المساعد" : "Close mascot"} className="absolute end-1 top-1 p-1 opacity-60 hover:opacity-100">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
