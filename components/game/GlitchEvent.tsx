"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Shield, RotateCcw, AlertTriangle, Smile, Frown, Zap, Ghost, Skull, Heart, Star, Zap as ZapIcon } from "lucide-react";
import { useGame } from "./GameProvider";
import { MascotSprite } from "@/components/theme/MascotSprite";
import { pick, type Locale, type Localized } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const GLITCH_KEY = "rawaj-glitch-consent";
const GLITCH_SEEN_KEY = "rawaj-glitch-seen";

type GlitchEvent = {
  id: string;
  name: Localized;
  description: Localized;
  mascotMood: "happy" | "excited" | "surprised" | "shocked" | "scared" | "evil" | "sad" | "wink";
  intensity: "mild" | "medium" | "intense";
  duration: number;
};

const GLITCH_EVENTS: GlitchEvent[] = [
  {
    id: "static_attack",
    name: { ar: "هجوم التشويش", en: "Static Attack" },
    description: { ar: "الشاشة بتهيج… الماسكوت بيبصلك بعينين واسعتين.", en: "The screen glitches… the mascot stares with wide eyes." },
    mascotMood: "surprised",
    intensity: "mild",
    duration: 3000,
  },
  {
    id: "inverted_colors",
    name: { ar: "ألوان مقلوبة", en: "Inverted Colors" },
    description: { ar: "كل الألوان اتعكست فجأة! الماسكوت بيشبه شبح.", en: "All colors suddenly inverted! The mascot looks like a ghost." },
    mascotMood: "scared",
    intensity: "medium",
    duration: 4000,
  },
  {
    id: "mascot_takeover",
    name: { ar: "استيلاء الماسكوت", en: "Mascot Takeover" },
    description: { ar: "الماسكوت سيطر على الشاشة وكبر لغاية ما غطى كل حاجة.", en: "The mascot took over the screen and grew until it covered everything." },
    mascotMood: "evil",
    intensity: "intense",
    duration: 5000,
  },
  {
    id: "fake_crash",
    name: { ar: "كراش مزيف", en: "Fake Crash" },
    description: { ar: "الموقع اتقفل فجأة… بس ده مجرد مقالبة!", en: "The site crashed suddenly… but it's just a prank!" },
    mascotMood: "shocked",
    intensity: "intense",
    duration: 3500,
  },
  {
    id: "glitch_text",
    name: { ar: "نص متشوش", en: "Glitched Text" },
    description: { ar: "الكلمات بتبدل مكانها وتظهر رسائل غامضة.", en: "Words swap places and mysterious messages appear." },
    mascotMood: "wink",
    intensity: "mild",
    duration: 3000,
  },
  {
    id: "audio_glitch",
    name: { ar: "صوت مشوش", en: "Audio Glitch" },
    description: { ar: "سمعت صوت تشويش غريب… الماسكوت بيمسك راسه.", en: "You heard a strange static sound… the mascot holds its head." },
    mascotMood: "sad",
    intensity: "medium",
    duration: 4000,
  },
  {
    id: "portal_open",
    name: { ar: "بوابة مفتوحة", en: "Portal Open" },
    description: { ar: "بوابة غريبة فتحت في نص الشاشة… الماسكوت بيطير منها.", en: "A strange portal opened in the middle of the screen… the mascot flies out of it." },
    mascotMood: "excited",
    intensity: "intense",
    duration: 5000,
  },
  {
    id: "safe_mode_trigger",
    name: { ar: "تفعيل الوضع الآمن", en: "Safe Mode Trigger" },
    description: { ar: "النظام كشف نشاط غريب وفعّل الوضع الآمن تلقائيًا.", en: "The system detected strange activity and auto-enabled safe mode." },
    mascotMood: "happy",
    intensity: "mild",
    duration: 3000,
  },
];

function getConsent(): boolean {
  try { return window.localStorage.getItem(GLITCH_KEY) === "1"; } catch { return false; }
}

function setConsent(val: boolean) {
  try { window.localStorage.setItem(GLITCH_KEY, val ? "1" : "0"); } catch {}
}

function getSeenCount(): number {
  try { return parseInt(window.localStorage.getItem(GLITCH_SEEN_KEY) || "0", 10); } catch { return 0; }
}

function incrementSeen() {
  try { const c = getSeenCount() + 1; window.localStorage.setItem(GLITCH_SEEN_KEY, String(c)); return c; } catch { return 0; }
}

export function GlitchEventProvider({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const { data } = useGame();
  const trapsOn = data.trapsOn;
  const reduce = !data.motionOn;
  const [showConsent, setShowConsent] = useState(false);
  const [activeEvent, setActiveEvent] = useState<GlitchEvent | null>(null);
  const [showSafeButton, setShowSafeButton] = useState(false);
  const consent = getConsent();

  // Check consent on mount
  useEffect(() => {
    if (!trapsOn || reduce) return;
    if (!consent) { setShowConsent(true); }
  }, [trapsOn, reduce, consent]);

  // Random glitch trigger (when consent given)
  useEffect(() => {
    if (!trapsOn || reduce || !consent || activeEvent) return;
    const interval = window.setInterval(() => {
      if (Math.random() < 0.01) {
        const event = GLITCH_EVENTS[Math.floor(Math.random() * GLITCH_EVENTS.length)];
        triggerEvent(event);
      }
    }, 60000);
    return () => window.clearInterval(interval);
  }, [trapsOn, reduce, consent, activeEvent]);

  const triggerEvent = (event: GlitchEvent) => {
    if (reduce) return;
    setActiveEvent(event);
    incrementSeen();
    setTimeout(() => setShowSafeButton(true), 1000);
    setTimeout(() => { setActiveEvent(null); setShowSafeButton(false); }, event.duration + 1000);
  };

  const handleConsent = (accepted: boolean) => {
    setConsent(accepted);
    setShowConsent(false);
    if (accepted) {
      setTimeout(() => { const event = GLITCH_EVENTS[0]; triggerEvent(event); }, 5000);
    }
  };

  const dismissEvent = () => { setActiveEvent(null); setShowSafeButton(false); };
  const toggleSafeMode = () => { dismissEvent(); };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape" && activeEvent) dismissEvent(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeEvent]);

  if (!activeEvent && !showConsent && !showSafeButton) return <>{children}</>;

  return (
    <>
      {children}
      <AnimatePresence>
        {showConsent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#03080F]/95 backdrop-blur p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md rounded-2xl border-4 border-[#E23A3A] bg-[#12090B] p-6 text-[#F3E8D2] shadow-[0_0_40px_-10px_rgba(226,58,58,0.4)]">
              <div className="flex items-center gap-2 mb-4"><span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#E23A3A]/20 text-[#E23A3A]"><AlertTriangle className="h-4 w-4" /></span><h3 className="text-[16px] font-black text-[#E23A3A]">{locale === "ar" ? "تحذير: وضع المقالب مفعل" : "Warning: Prank Mode Active"}</h3></div>
              <p className="text-[13px] leading-relaxed text-[#F3E8D2]/80 mb-4">{locale === "ar" ? "هذا الموقع يحتوي على أحداث \"مقلوبة\" عشوائية (Glitch Events) بتظهر فجأة: شاشة بتتهيج، ألوان بتتعكس، الماسكوت بيسيطر، كراش مزيف، وأصوات مشوشة. كلها مزاح خفيف ومحدود بالوقت، وعندك زر \"أمان 🌈\" لإيقافها فورًا." : "This site has random \"glitch events\" that appear suddenly: screen glitches, color inversion, mascot takeover, fake crash, and audio glitches. All are harmless jokes with time limits, and you have a \"Safe 🌈\" button to stop them instantly."}</p>
              <div className="rounded-xl border border-[#E23A3A]/30 bg-[#E23A3A]/10 p-3 mb-4 text-[11px] text-[#F3E8D2]/70"><p className="font-bold">{locale === "ar" ? "قواعد المقالب:" : "Prank Rules:"}</p><ul className="mt-2 list-disc space-y-1 pl-5 text-[11px]"><li>{locale === "ar" ? "محدودة بالوقت (3-5 ثواني)" : "Time-limited (3-5 seconds)"}</li><li>{locale === "ar" ? "لا تأثير دائم على الموقع" : "No permanent site effects"}</li><li>{locale === "ar" ? "زر \"أمان 🌈\" يوقفها فورًا" : "\"Safe 🌈\" button stops them instantly"}</li><li>{locale === "ar" ? "تحترم prefers-reduced-motion" : "Respects prefers-reduced-motion"}</li></ul></div>
              <div className="flex gap-2"><button type="button" onClick={() => handleConsent(false)} className="flex-1 rounded-xl border border-[#E23A3A]/50 bg-[#12090B] px-4 py-3 text-[13px] font-bold text-[#E23A3A] transition hover:bg-[#E23A3A]/20">{locale === "ar" ? "أوقف المقالب" : "Disable Pranks"}</button><button type="button" onClick={() => handleConsent(true)} className="flex-1 rounded-xl bg-[#E23A3A] px-4 py-3 text-[13px] font-black text-[#F3E8D2] shadow-[0_0_20px_-5px_rgba(226,58,58,0.4)] transition hover:bg-[#E23A3A]/80">{locale === "ar" ? "أوافق، ابدأ المقالب" : "I Agree, Start Pranks"}</button></div>
              <p className="mt-3 text-center text-[10px] text-[#F3E8D2]/40">{locale === "ar" ? "ممكن توقف المقالب من الإعدادات في HUD في أي وقت." : "You can disable pranks from HUD settings anytime."}</p>
            </motion.div>
          </motion.div>
        )}
        {activeEvent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#03080F]/98 backdrop-blur p-4">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative w-full max-w-lg rounded-2xl overflow-hidden" style={{ border: `4px solid ${activeEvent.intensity === "intense" ? "#E23A3A" : activeEvent.intensity === "medium" ? "#E23A3A" : "#FFF83F"}`, background: activeEvent.intensity === "intense" ? "radial-gradient(circle at 50% 50%, #1A0828 0%, #080312 100%)" : "#0A0A0A", boxShadow: "0 0 60px -10px rgba(226,58,58,0.5)" }}>
              <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)" }} />
              <div className="relative flex h-48 items-center justify-center"><MascotSprite theme="horror" mood={activeEvent.mascotMood} className="h-40 w-40" /></div>
              <div className="p-6 text-center text-[#F3E8D2]"><p className="font-pixel text-[10px] tracking-[0.2em] text-[#E23A3A] mb-2">GLITCH EVENT</p><h3 className="text-[22px] font-black leading-tight mb-2" style={{ fontFamily: "var(--font-px-ar),sans-serif", textShadow: "0 0 10px rgba(226,58,58,0.5)" }}>{pick(activeEvent.name, locale)}</h3><p className="text-[14px] leading-relaxed text-[#F3E8D2]/80 mb-4">{pick(activeEvent.description, locale)}</p><div className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#FFF83F]/80 mb-4"><ZapIcon className="h-3.5 w-3.5 animate-pulse" /><span>{locale === "ar" ? `الشدة: ${activeEvent.intensity === "intense" ? "عالية" : activeEvent.intensity === "medium" ? "متوسطة" : "خفيفة"}` : `Intensity: ${activeEvent.intensity}`}</span><span className="mx-1">|</span><span>{locale === "ar" ? `المدة: ${Math.round(activeEvent.duration / 1000)}ث` : `Duration: ${Math.round(activeEvent.duration / 1000)}s`}</span></div></div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"><button type="button" onClick={dismissEvent} className="rounded-full bg-[#FFF83F]/20 border-2 border-[#FFF83F] px-4 py-2 text-[12px] font-black text-[#FFF83F] transition hover:bg-[#FFF83F] hover:text-[#12090B]"><Shield className="h-3.5 w-3.5 mr-1" />{locale === "ar" ? "أمان 🌈" : "Safe 🌈"}</button></div>
            </motion.div>
          </motion.div>
        )}
        {showSafeButton && !activeEvent && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-4 end-4 z-[9997]"><button type="button" onClick={toggleSafeMode} className="rounded-full bg-[#FFF83F]/20 border-2 border-[#FFF83F] px-3 py-1.5 text-[11px] font-black text-[#FFF83F] shadow-[0_0_20px_-5px_rgba(255,248,63,0.3)] transition hover:bg-[#FFF83F] hover:text-[#12090B]"><Shield className="h-3.5 w-3.5 mr-1" />{locale === "ar" ? "أمان 🌈" : "Safe 🌈"}</button></motion.div>
        )}
      </AnimatePresence>
    </>
  );
}