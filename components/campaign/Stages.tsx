"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown, ArrowUp, CalendarDays, Check, ChevronLeft, ChevronRight,
  Clapperboard, Coins, ExternalLink, GripVertical, Megaphone, Palette,
  Play, Rocket, ShieldCheck, Sparkles, Target, Users, Wallet, X, Zap, Maximize2,
} from "lucide-react";
import { useGame } from "@/components/game/GameProvider";
import { getService } from "@/content/services";
import { showcaseVideos as fallbackShowcase } from "@/content/showcase";
import { team } from "@/content/team";
import {
  adsChannels, adsCopy, contentItems, identityCopy, launchCopy, palette,
  reportServiceReason, socialCopy, stages, strategyCopy, strategySteps,
  strengthCopy, type CalendarType, type StrategyStepId,
} from "@/content/campaign";
import { pick, type Locale } from "@/lib/i18n";
import { cn, whatsappHref } from "@/lib/utils";
import { siteConfig } from "@/content/site";
import { fetchPublishedVideosClient } from "@/lib/cms/public-client";
import { REPLAY_CATEGORIES, type ReplayVideoRow } from "@/lib/cms/types";
import { getEmbedInfo } from "@/lib/cms/embed";

export function StageTag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-500/[0.08] px-2.5 py-1 font-pixel text-[8px] uppercase tracking-[0.12em] text-brand-200">{children}</span>;
}

function Reward({ xp, coins, locale }: { xp: number; coins: number; locale: Locale }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-[11px] font-black">
      {xp > 0 ? <span className="inline-flex items-center gap-1 rounded-full bg-accent/12 px-2 py-1 text-accent"><Zap className="h-3 w-3" /> {xp} XP</span> : null}
      {coins > 0 ? <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-2 py-1 text-brand-200"><Coins className="h-3 w-3" /> {coins}</span> : null}
    </span>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p role="alert" className="mt-2 text-[11.5px] font-semibold text-red-300">{children}</p>;
}

export function IdentityStage({ locale }: { locale: Locale }) {
  const { data, setCampaign, finishStage, sound } = useGame();
  const [name, setName] = useState(data.campaign.brandName);
  const [colors, setColors] = useState<string[]>(data.campaign.palette);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(!data.campaign.brandName);
  const done = Boolean(data.campaign.brandName) && data.campaign.palette.length >= 2 && !editing;
  const toggleColor = (hex: string) => { sound("click"); setColors((prev) => { if (prev.includes(hex)) return prev.filter((v) => v !== hex); if (prev.length >= 3) return [...prev.slice(1), hex]; return [...prev, hex]; }); };
  const submit = () => { if (name.trim().length < 2) { setError(pick(identityCopy.errorName, locale)); return; } if (colors.length < 2) { setError(pick(identityCopy.errorPalette, locale)); return; } setError(null); setCampaign({ brandName: name.trim(), palette: colors }); finishStage({ stage: 0, xp: stages[0].xp, coins: stages[0].coins, label: locale === "ar" ? "هوية براندك جاهزة" : "Your brand identity is locked" }); setEditing(false); };
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="border-4 border-[#1A2D45] bg-[#050D1A] p-5 shadow-[4px_4px_0_#040B14]">
          <label htmlFor="brand-name" className="font-pixel text-[9px] text-[#7CC6FF]">{pick(identityCopy.ask, locale)}</label>
          <input id="brand-name" value={name} onChange={(ev) => { setName(ev.target.value.slice(0, 24)); setError(null); setEditing(true); }} placeholder={pick(identityCopy.placeholder, locale)} className="field mt-2 border-[#2391FF] bg-[#040B14]" maxLength={24} autoComplete="off" />
          <p className="mt-5 text-[12px] font-bold text-[#8FA8C4]">{pick(identityCopy.paletteLabel, locale)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {palette.map((swatch) => { const active = colors.includes(swatch.hex); return (
              <button key={swatch.hex} type="button" onClick={() => { toggleColor(swatch.hex); setEditing(true); }} aria-pressed={active} className={cn("flex items-center gap-2 border-2 px-2.5 py-2 text-[11.5px] font-bold", active ? "border-[#FFF83F] bg-[#1a1600] text-[#FFF83F]" : "border-[#1A2D45] text-[#8FA8C4] hover:border-[#2391FF]")}>
                <span className="h-4 w-4 border border-white/25" style={{ backgroundColor: swatch.hex }} />{pick(swatch.name, locale)}{active ? <Check className="h-3.5 w-3.5" /> : null}
              </button>
            ); })}
          </div>
          {error ? <FieldError>{error}</FieldError> : null}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={submit} className="btn-accent !px-5 !py-2.5 text-[13px]"><Palette className="h-4 w-4" />{pick(identityCopy.cta, locale)}</button>
            {data.campaign.brandName ? <button type="button" onClick={() => setEditing(!editing)} className="text-[11.5px] font-semibold text-[#8FA8C4] underline underline-offset-4 hover:text-[#FFF83F]">{editing ? (locale === "ar" ? "عرض الهوية المحفوظة" : "View saved identity") : (locale === "ar" ? "تعديل الهوية" : "Edit identity")}</button> : null}
            <Reward xp={stages[0].xp} coins={stages[0].coins} locale={locale} />
          </div>
        </div>
        <div className="mt-4 border-4 border-[#1A2D45] bg-[#0A1626] p-5"><p className="flex items-center gap-2 font-pixel text-[8px] uppercase tracking-[0.14em] text-[#7CC6FF]"><Sparkles className="h-3 w-3" /> {pick(identityCopy.aboutTitle, locale)}</p><p className="mt-2 text-[13px] leading-relaxed text-[#A9BCD1]">{pick(identityCopy.about, locale)}</p></div>
      </div>
      <div className="space-y-3">
        <div className="relative overflow-hidden border-4 border-[#2391FF] bg-[#040B14] p-5" style={{ boxShadow: `6px 6px 0 ${colors[0] ?? "#2391FF"}` }}>
          <div className="flex items-center gap-2">{colors.map((hex) => <span key={hex} className="h-4 w-4 border border-white/25" style={{ backgroundColor: hex }} />)}<span className="font-pixel ms-auto text-[8px] text-white/40">BRAND CARD</span></div>
          <p className="mt-4 text-[28px] font-black text-white">{name.trim() || (locale === "ar" ? "اسم براندك" : "Your brand")}</p>
          <p className="mt-1 font-pixel text-[8px] uppercase tracking-[0.14em] text-[#7CC6FF]">{locale === "ar" ? "حملة رَواج" : "RAWAJ CAMPAIGN"}</p>
        </div>
        {done ? <div className="border-4 border-[#FFF83F] bg-[#1a1600] p-4 text-center"><Check className="mx-auto h-5 w-5 text-[#FFF83F]" /><p className="mt-1.5 text-[13px] font-extrabold text-[#FFF83F]">{locale === "ar" ? "الهوية معتمدة" : "Identity locked"}</p></div> : null}
      </div>
    </div>
  );
}

export function StrategyStage({ locale }: { locale: Locale }) {
  const { data, finishStage, sound } = useGame();
  const initial = data.campaign.strategy.length === 4 ? (data.campaign.strategy as StrategyStepId[]) : (["channel", "audience", "budget", "goal"] as StrategyStepId[]);
  const [order, setOrder] = useState<StrategyStepId[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const done = data.campaign.strategy.length === 4 && data.campaign.stage > 1;
  const labels = useMemo(() => Object.fromEntries(strategySteps.map((s) => [s.id, s])) as Record<StrategyStepId, (typeof strategySteps)[number]>, []);
  const move = (index: number, dir: -1 | 1) => { const target = index + dir; if (target < 0 || target >= order.length) return; const next = [...order]; [next[index], next[target]] = [next[target], next[index]]; setOrder(next); setError(null); sound("click"); };
  const dropAt = (target: number) => { if (dragIndex === null || dragIndex === target) return; const next = [...order]; const [item] = next.splice(dragIndex, 1); next.splice(target, 0, item); setOrder(next); setDragIndex(null); setError(null); };
  const submit = () => { const correct = ["audience","goal","channel","budget"].every((id,i)=>order[i]===id); if (!correct) { setError(pick(strategyCopy.wrong, locale)); sound("error"); return; } setError(null); finishStage({ stage: 1, xp: stages[1].xp, coins: stages[1].coins, label: locale === "ar" ? "خطة تسويق مرتبة" : "Marketing plan sequenced", patch: { strategy: order } }); };
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="border-4 border-[#2391FF] bg-[#0B1320] p-5 shadow-[6px_6px_0_#040B14]">
        <p className="text-[12.5px] leading-relaxed text-[#9FB4CC]">{pick(strategyCopy.brief, locale)}</p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {order.map((id, index) => { const step = labels[id]; return (
            <li key={id} draggable={!done} onDragStart={() => setDragIndex(index)} onDragOver={(ev) => ev.preventDefault()} onDrop={() => dropAt(index)} className={cn("flex items-center gap-2 border-2 bg-[#141F33] px-3 py-3 transition", dragIndex === index ? "border-[#FFF83F] opacity-70" : done ? "border-[#2391FF]/50" : "border-[#2391FF]/25")}>
              <span className="cursor-grab text-[#9FB4CC]" aria-hidden="true"><GripVertical className="h-4 w-4" /></span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#2391FF] bg-[#2391FF]/15 font-pixel text-[9px] text-[#7CC6FF]">{index + 1}</span>
              <span className="min-w-0 flex-1"><span className="block text-[13px] font-extrabold text-[#EAF2FF]">{pick(step.label, locale)}</span><span className="mt-0.5 block text-[10.5px] leading-relaxed text-[#9FB4CC]">{pick(step.hint, locale)}</span></span>
              {done ? <Check className="h-4 w-4 shrink-0 text-[#FFF83F]" /> : null}
              <span className="flex shrink-0 flex-col gap-1"><button type="button" onClick={() => move(index,-1)} disabled={done||index===0} aria-label={locale==="ar"?"تحريك لأعلى":"Move up"} className="border border-[#2391FF]/30 p-0.5 text-[#9FB4CC] disabled:opacity-20"><ArrowUp className="h-3 w-3"/></button><button type="button" onClick={() => move(index,1)} disabled={done||index===order.length-1} aria-label={locale==="ar"?"تحريك لأسفل":"Move down"} className="border border-[#2391FF]/30 p-0.5 text-[#9FB4CC] disabled:opacity-20"><ArrowDown className="h-3 w-3"/></button></span>
            </li>); })}
        </ol>
        {error ? <FieldError>{error}</FieldError> : null}
        <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={submit} disabled={done} className="btn-accent !px-5 !py-2.5 text-[13px] disabled:opacity-50"><Target className="h-4 w-4" />{done ? (locale === "ar" ? "الخطة معتمدة" : "Plan approved") : pick(strategyCopy.cta, locale)}</button><Reward xp={stages[1].xp} coins={stages[1].coins} locale={locale} /></div>
      </div>
      <aside className="space-y-3"><div className="border-4 border-[#2391FF]/40 bg-[#141F33] p-4"><p className="font-pixel text-[8px] uppercase tracking-[0.14em] text-[#7CC6FF]">MOSAIC TIP</p><p className="mt-2 text-[12px] leading-relaxed text-[#9FB4CC]">{pick(strategyCopy.hint, locale)}</p></div>{done ? <div className="border-4 border-[#FFF83F]/50 bg-[#1b1a10] p-4"><p className="text-[12.5px] font-extrabold text-[#FFF83F]">{locale === "ar" ? "خطة سليمة" : "A sound plan"}</p><p className="mt-1.5 text-[11.5px] leading-relaxed text-[#D7CFA0]">{pick(strategyCopy.success, locale)}</p></div> : null}</aside>
    </div>
  );
}

const typeLabels: Record<CalendarType, { ar: string; en: string }> = { edu: { ar: "تعليمي", en: "Educational" }, engage: { ar: "تفاعلي", en: "Interactive" }, offer: { ar: "عرض", en: "Offer" }, story: { ar: "قصة", en: "Story" }, launch: { ar: "إطلاق", en: "Launch" } };

export function CalendarStage({ locale }: { locale: Locale }) {
  const { data, finishStage, sound } = useGame();
  const [placed, setPlaced] = useState<Record<string, string>>(data.campaign.calendar ?? {});
  const [dragging, setDragging] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const done = data.campaign.stage > 2;
  const usedItems = Object.values(placed);
  const types = new Set(usedItems.map((id) => contentItems.find((item) => item.id === id)?.type).filter(Boolean) as CalendarType[]);
  const engagement = usedItems.reduce((t, id) => t + (contentItems.find((item) => item.id === id)?.engagement ?? 0), 0) + (types.size >= 4 ? 8 : 0);
  const place = (day: string, itemId: string) => { setPlaced((prev) => { const next: Record<string,string> = {}; for (const [k,v] of Object.entries(prev)) { if (v !== itemId) next[k]=v; } return { ...next, [day]: itemId }; }); setError(null); sound("pop"); };
  const clear = () => { setPlaced({}); setError(null); };
  const submit = () => { if (usedItems.length < contentItems.length) { setError(pick(socialCopy.errorEmpty, locale)); return; } if (!types.has("edu") || !types.has("engage") || !types.has("offer")) { setError(pick(socialCopy.errorMix, locale)); return; } setError(null); finishStage({ stage: 2, xp: stages[2].xp, coins: stages[2].coins, label: locale === "ar" ? "أسبوع محتوى متوازن" : "Balanced content week", patch: { calendar: placed, engagement } }); };
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="relative overflow-hidden rounded-[28px] border-4 border-[#10243B] bg-[#DFF6FF] p-5 text-[#10243B]">
        <div aria-hidden className="pointer-events-none absolute -top-16 -end-10 h-40 w-40 rounded-full bg-[#7DD3FC]/50" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 start-0 h-40 w-72 rounded-full bg-[#2391FF]/15" />
        <p className="relative text-[13px] font-bold leading-relaxed text-[#10243B]/75">{pick(socialCopy.brief, locale)}</p>
        <div className="relative mt-4 flex flex-wrap gap-2">
          {contentItems.map((item) => { const used = usedItems.includes(item.id); return (
            <button key={item.id} type="button" draggable={!used && !done} onDragStart={() => setDragging(item.id)} onClick={() => { if (used) { setPlaced((prev) => { const next = { ...prev }; for (const [d,v] of Object.entries(next)) { if (v===item.id) delete next[d]; } return next; }); sound("click"); } else { setDragging(dragging===item.id?null:item.id); } }} aria-pressed={Boolean(dragging===item.id)} className={cn("flex items-center gap-2 rounded-full border-2 border-[#10243B] px-3 py-1.5 text-[12px] font-bold shadow-[3px_3px_0_#10243B]", used ? "bg-[#FFF83F] text-[#10243B]/60" : dragging===item.id ? "bg-[#2391FF] text-white" : "bg-white text-[#10243B]")}>
              <span className="h-2 w-2 rounded-full bg-[#2391FF]" />{pick(item.label, locale)}<span className="text-[10px] opacity-60">+{item.engagement}</span>
            </button>
          ); })}
        </div>
        <div className="relative mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {socialCopy.days.map((day, index) => { const key = String(index); const itemId = placed[key]; const item = contentItems.find((e) => e.id === itemId); return (
            <button key={day.en} type="button" disabled={done} onDragOver={(ev)=>ev.preventDefault()} onDrop={() => { if (dragging) { place(key, dragging); setDragging(null); } }} onClick={() => { if (dragging) { place(key, dragging); setDragging(null); } else if (itemId) { setPlaced((prev)=>{ const next={...prev}; delete next[key]; return next; }); sound("click"); } }} className={cn("min-h-[88px] rounded-[20px] border-4 border-[#10243B] p-3 text-start shadow-[4px_4px_0_#10243B]", item ? "bg-[#FFF83F]" : "bg-white/80 border-dashed")}>
              <span className="text-[10px] font-black uppercase tracking-[0.08em] text-[#10243B]/55">{pick(day, locale)}</span>
              {item ? (<><span className="mt-1 block text-[12px] font-black leading-tight">{pick(item.label, locale)}</span><span className="mt-2 inline-block rounded-full bg-[#2391FF] px-2 py-0.5 text-[10px] font-bold text-white">{typeLabels[item.type][locale]}</span></>) : <span className="mt-3 block text-[11px] font-semibold text-[#10243B]/45">{locale === "ar" ? "أفلت هنا" : "Drop here"}</span>}
            </button>
          ); })}
        </div>
        {error ? <FieldError>{error}</FieldError> : null}
        <div className="relative mt-4 flex flex-wrap items-center gap-2.5"><button type="button" onClick={submit} disabled={done} className="rounded-full border-4 border-[#10243B] bg-[#2391FF] px-5 py-3 text-[13px] font-black text-white shadow-[4px_4px_0_#10243B] disabled:opacity-50"><CalendarDays className="h-4 w-4" />{done ? (locale === "ar" ? "الأسبوع مجدول" : "Week scheduled") : pick(socialCopy.cta, locale)}</button><button type="button" onClick={clear} disabled={done} className="text-[12px] font-bold underline decoration-2 underline-offset-4">{pick(socialCopy.clear, locale)}</button><Reward xp={stages[2].xp} coins={stages[2].coins} locale={locale} /></div>
      </div>
      <aside className="space-y-3">
        <div className="rounded-[24px] border-4 border-[#10243B] bg-white p-4 text-[#10243B] shadow-[4px_4px_0_#10243B]">
          <p className="text-[12px] font-black">{pick(socialCopy.engagementLabel, locale)}</p>
          <p className="mt-1 text-[34px] font-black leading-none text-[#2391FF]" style={{ fontFamily: "var(--font-baloo),sans-serif" }}>{engagement}</p>
          <div className="mt-3 h-4 overflow-hidden rounded-full border-2 border-[#10243B] bg-[#DFF6FF]"><div className="h-full bg-[#FFF83F]" style={{ width: `${Math.min(100, (engagement / 60) * 100)}%` }} /></div>
        </div>
        {done ? <div className="rounded-[24px] border-4 border-[#10243B] bg-[#FFF83F] p-4 text-[#10243B] shadow-[4px_4px_0_#10243B]"><p className="text-[13px] font-black">{locale === "ar" ? "أسبوع ناجح" : "A winning week"}</p><p className="mt-1.5 text-[12px] font-semibold leading-relaxed">{pick(socialCopy.success, locale)}</p></div> : null}
      </aside>
    </div>
  );
}

const TOTAL_BUDGET = 10000;
export function AdsStage({ locale }: { locale: Locale }) {
  const { data, finishStage, sound } = useGame();
  const [budget, setBudget] = useState(data.campaign.budget);
  const [error, setError] = useState<string | null>(null);
  const done = data.campaign.stage > 3;
  const allocated = budget.meta + budget.tiktok + budget.google;
  const remaining = TOTAL_BUDGET - allocated;
  const metrics = adsChannels.map((channel) => { const spend = budget[channel.id]; const reach = Math.round((spend / channel.cpm) * 1000); return { channel, spend, reach, clicks: Math.round(reach * channel.ctr), sales: Math.round(reach * channel.ctr * channel.cvr) }; });
  const totals = metrics.reduce((acc, e) => ({ reach: acc.reach + e.reach, clicks: acc.clicks + e.clicks, sales: acc.sales + e.sales }), { reach: 0, clicks: 0, sales: 0 });
  const submit = () => { if (allocated !== TOTAL_BUDGET) { setError(pick(adsCopy.errorTotal, locale)); return; } if (adsChannels.some((ch) => budget[ch.id] < 1000)) { setError(pick(adsCopy.errorSpread, locale)); return; } setError(null); finishStage({ stage: 3, xp: stages[3].xp, coins: stages[3].coins, label: locale === "ar" ? "حملتك جاهزة للإطلاق" : "Campaign ready to launch", patch: { budget, reach: totals.reach, clicks: totals.clicks, sales: totals.sales } }); sound("win"); };

  return (
    <div className="relative overflow-hidden rounded-[28px] border-4 border-[#12090B] bg-[#12090B] p-4 text-[#F3E8D2] sm:p-6" style={{ boxShadow: "8px 8px 0 #000" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(135deg,#F3E8D2 0 2px,transparent 2px 18px)" }} />
      <div aria-hidden className="pointer-events-none absolute -start-10 top-10 text-[120px] font-black leading-none text-[#E23A3A]/20 sm:text-[180px]" style={{ fontFamily: "var(--font-alex),sans-serif" }}>ADS</div>
      <div className="relative grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-[24px] border-4 border-[#12090B] bg-[#F3E8D2] p-5 text-[#12090B]">
          <p className="inline-flex rounded-full bg-[#E23A3A] px-3 py-1 text-[11px] font-black text-[#F3E8D2]">MILES POSTER MODE</p>
          <p className="mt-3 text-[13px] font-semibold leading-relaxed text-[#12090B]/75">{pick(adsCopy.brief, locale)}</p>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border-2 border-[#12090B] bg-white/60 p-3">
            <span className="text-[12px] font-bold">{pick(adsCopy.allocated, locale)}: <b>{allocated.toLocaleString("en-US")}</b> / 10,000</span>
            <span className={cn("rounded-full px-3 py-1 text-[11px] font-black", remaining === 0 ? "bg-[#2391FF] text-[#040B14]" : remaining < 0 ? "bg-[#E23A3A] text-white" : "bg-[#12090B] text-[#F3E8D2]")}>{pick(adsCopy.remaining, locale)}: {remaining.toLocaleString("en-US")}</span>
          </div>
          <div className="mt-4 space-y-4">
            {adsChannels.map((channel) => (
              <div key={channel.id} className="rounded-2xl border-2 border-[#12090B]/15 bg-[#12090B]/[0.03] p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-[13px] font-black"><span className="h-3 w-3 rounded-full border border-[#12090B]" style={{ backgroundColor: channel.color }} />{pick(channel.name, locale)}<span className="text-[10px] font-semibold text-[#12090B]/55">{pick(channel.note, locale)}</span></span>
                  <span className="text-[13px] font-black text-[#E23A3A]">{budget[channel.id].toLocaleString("en-US")} EGP</span>
                </div>
                <input type="range" min={0} max={TOTAL_BUDGET} step={500} value={budget[channel.id]} disabled={done} aria-label={`${pick(channel.name, locale)} budget`} onChange={(ev) => { setBudget((prev) => ({ ...prev, [channel.id]: Number(ev.target.value) })); setError(null); }} className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#12090B]/15" style={{ accentColor: channel.color }} />
              </div>
            ))}
          </div>
          {error ? <FieldError>{error}</FieldError> : null}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={submit} disabled={done} className="inline-flex items-center gap-2 rounded-full border-4 border-[#12090B] bg-[#E23A3A] px-5 py-3 text-[13px] font-black text-[#F3E8D2] shadow-[4px_4px_0_#12090B] disabled:opacity-50"><Megaphone className="h-4 w-4" />{done ? (locale === "ar" ? "الحملة اتطلقت" : "Campaign launched") : pick(adsCopy.cta, locale)}</button>
            <Reward xp={stages[3].xp} coins={stages[3].coins} locale={locale} />
          </div>
          <p className="mt-2 text-[11px] text-[#12090B]/55">{pick(adsCopy.disclaimer, locale)}</p>
        </div>

        <aside className="relative rounded-[24px] border-4 border-[#F3E8D2]/20 bg-[#1A0D10] p-4">
          <div className="flex items-center justify-between">
            <p className="font-pixel text-[8px] tracking-[0.2em] text-[#F3E8D2]/70">LIVE SIMULATION</p>
            <span className="rounded-full bg-[#F3E8D2] px-2 py-1 text-[10px] font-black text-[#12090B]">RAWAJ ADS</span>
          </div>
          <div className="mt-4 grid gap-3">
            {[{ label: pick(adsCopy.reach, locale), value: totals.reach, icon: Users, color: "#2391FF" }, { label: pick(adsCopy.clicks, locale), value: totals.clicks, icon: Target, color: "#FFF83F" }, { label: pick(adsCopy.sales, locale), value: totals.sales, icon: Wallet, color: "#7CFFB2" }].map((m) => (
              <div key={m.label} className="rounded-[20px] border-2 border-[#F3E8D2]/20 bg-[#F3E8D2] px-4 py-3 text-[#12090B] shadow-[4px_4px_0_#000]">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-[12px] font-bold"><m.icon className="h-4 w-4" style={{ color: m.color === "#FFF83F" ? "#9A8B00" : m.color }} />{m.label}</span>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                </div>
                <motion.div key={m.value} initial={{ opacity: 0.45, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-[30px] font-black leading-none" style={{ fontFamily: "var(--font-alex),sans-serif" }}>{m.value.toLocaleString("en-US")}</motion.div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-[#E23A3A]/40 bg-[#E23A3A]/10 p-3 text-[11px] leading-relaxed text-[#F3E8D2]/80">
            <Megaphone className="mb-1 h-4 w-4 text-[#FFF83F]" />{locale === "ar" ? "عنصر بصري أصلي: مكبر صوت/طاقة حملة — بدون نسخ أي شخصية." : "Original hero element: campaign megaphone/energy — no copied characters."}
          </div>
        </aside>
      </div>
    </div>
  );
}
type ReplayItem = {
  id: string;
  url: string;
  platform?: string | null;
  title: string;
  description: string;
  thumbnail?: string | null;
  category?: string | null;
  orientation?: string | null;
  source: "db" | "fallback";
};

export function ReplayStage({ locale }: { locale: Locale }) {
  const { data, finishStage, grantCampaignXp } = useGame();
  const completed = data.campaign.stage > 4;
  const watched = data.campaign.replayWatched ?? [];
  const replayXpEarned = Math.min(50, watched.length * 10);
  const [items, setItems] = useState<ReplayItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await fetchPublishedVideosClient();
        if (!alive) return;
        if (rows && rows.length) {
          setItems(rows.map((v) => ({
            id: v.id,
            url: v.url,
            platform: v.platform,
            title: (locale === "ar" ? (v.title_ar || v.title_en) : (v.title_en || v.title_ar)) || v.url,
            description: (locale === "ar" ? (v.description_ar || v.description_en) : (v.description_en || v.description_ar)) || "",
            thumbnail: v.thumbnail_url || null,
            category: v.category || "أخرى",
            orientation: v.orientation || "horizontal",
            source: "db",
          })));
        } else {
          const fb = fallbackShowcase.filter((v) => Boolean(v.url)).map((v) => ({
            id: v.id,
            url: v.url!,
            platform: "mp4",
            title: pick(v.title, locale),
            description: "",
            thumbnail: v.thumbnail || null,
            category: v.category ? pick(v.category, locale) : "أخرى",
            orientation: "horizontal",
            source: "fallback" as const,
          }));
          setItems(fb);
        }
      } catch {
        const fb = fallbackShowcase.filter((v) => Boolean(v.url)).map((v) => ({
          id: v.id, url: v.url!, platform: "mp4", title: pick(v.title, locale), description: "", thumbnail: v.thumbnail || null, category: "أخرى", orientation: "horizontal", source: "fallback" as const,
        }));
        setItems(fb);
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => { alive = false; };
  }, [locale]);

  const videos = items;
  const categories = useMemo(() => {
    const base = [...REPLAY_CATEGORIES];
    for (const v of videos) if (v.category && !base.includes(v.category as any)) base.push(v.category as any);
    return ["all", ...base];
  }, [videos]);

  const filtered = filter === "all" ? videos : videos.filter((v) => (v.category || "") === filter);

  useEffect(() => {
    if (!loaded) return;
    if (videos.length === 0 && !completed) {
      finishStage({ stage: 4, xp: 0, coins: 0, label: locale === "ar" ? "غرفة العرض (قريبًا)" : "Replay room (coming soon)" });
    }
  }, [loaded, videos.length, completed, finishStage, locale]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const markWatched = (id: string) => {
    if (watched.includes(id)) return;
    if (replayXpEarned >= 50) return;
    grantCampaignXp(10, locale === "ar" ? "شاهدت عملًا موثقًا" : "Watched verified work", { replayWatched: [...watched, id] });
  };

  const openVideo = (id: string) => {
    setActiveId((cur) => (cur === id ? null : id));
    markWatched(id);
  };

  if (!loaded) {
    return <div className="rounded-[28px] border-2 border-[#074B52]/30 bg-[#EAFBFF]/10 p-6 text-center text-sm text-[#EAFBFF]/70">{locale === "ar" ? "جارٍ تحميل غرفة العرض..." : "Loading replay room..."}</div>;
  }
  if (videos.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-[28px] border-2 border-dashed border-[#EAFBFF]/35 bg-[#074B52]/20 p-8 text-center">
          <Clapperboard className="mx-auto h-12 w-12 text-[#FFF83F]/80" />
          <p className="mt-3 font-pixel text-[9px] uppercase tracking-[0.14em] text-[#EAFBFF]/70">COMING SOON</p>
          <h3 className="mt-2 text-[28px] font-black text-[#EAFBFF]" style={{fontFamily:'var(--font-baloo),sans-serif'}}>{locale === "ar" ? "الفيديوهات الجاية قريبًا" : "Videos coming soon"}</h3>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-[#D9F3F8]/80">{locale === "ar" ? "غرفة العرض هتعرض أعمال رَواج الموثقة. لا توجد فيديوهات منشورة حاليًا (تُضاف من لوحة التحكم فقط)." : "The replay room shows verified RAWAJ work. No published videos yet (added from admin only)."}</p>
          <p className="mt-4 inline-flex rounded-full bg-[#FFF83F] px-4 py-2 text-[11.5px] font-black text-[#074B52]">{locale === "ar" ? "تم تجاوز المرحلة تلقائيًا عند الدخول (بدون XP أو عملات)." : "Stage auto-passed on entry (no XP, no coins)."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-[24px] bg-[#074B52]/25 px-4 py-3">
        <p className="text-[12px] font-bold text-[#EAFBFF]/80">{locale === "ar" ? `شاهدت ${watched.length} / ${videos.length} — +${replayXpEarned} XP (حد أقصى 50، مرة واحدة لكل فيديو)` : `Watched ${watched.length} / ${videos.length} — +${replayXpEarned} XP (max 50, once per video)`}</p>
        <span className="text-[11px] text-[#EAFBFF]/55">{locale === "ar" ? "تحميل كسول · بدون تشغيل تلقائي · Esc للإغلاق" : "Lazy load · no autoplay · Esc to close"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)} className={cn("rounded-full border-2 px-3 py-1.5 text-[11px] font-black transition", filter === c ? "border-[#FFF83F] bg-[#FFF83F] text-[#074B52]" : "border-[#EAFBFF]/30 bg-[#074B52]/20 text-[#EAFBFF]/80 hover:border-[#FFF83F]/60")}>
            {c === "all" ? (locale === "ar" ? "الكل" : "All") : c}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((video) => {
          const seen = watched.includes(video.id);
          const active = activeId === video.id;
          const embed = getEmbedInfo(video.url, video.platform);
          const isVertical = (video.orientation || "").toLowerCase().includes("vert");
          return (
            <article key={video.id} className="overflow-hidden rounded-[28px] border-4 border-[#074B52]/60 bg-[#0C5E68] shadow-[0_8px_0_#074B52]">
              <div className={cn("relative w-full bg-black/50", isVertical ? "aspect-[9/16] max-h-[420px]" : "aspect-video")}>
                {active ? (
                  <>
                    {embed.type === "mp4" ? (
                      <video src={embed.src} controls playsInline className="h-full w-full object-contain" />
                    ) : embed.type === "external" ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center">
                        <p className="text-sm text-ink/70">{locale === "ar" ? "هذا الرابط غير مدعوم للتضمين." : "This link can't be embedded."}</p>
                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn-accent !px-4 !py-2 text-[12px]">{locale === "ar" ? "افتح الفيديو" : "Open video"} <ExternalLink className="h-3.5 w-3.5" /></a>
                      </div>
                    ) : (
                      <iframe src={embed.src} title={video.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    )}
                    <button type="button" onClick={() => setActiveId(null)} aria-label={locale === "ar" ? "إغلاق" : "Close"} className="absolute top-2 end-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"><X className="h-4 w-4" /></button>
                  </>
                ) : (
                  <button type="button" onClick={() => openVideo(video.id)} className="group relative h-full w-full">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500/20 to-abyss"><Clapperboard className="h-10 w-10 text-white/30" /></div>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-[#063A40]/25 transition group-hover:bg-[#063A40]/35">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#074B52] bg-[#FFF83F] text-[#074B52] shadow-lg"><Play className="h-5 w-5 ms-0.5" /></span>
                    </span>
                  </button>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-extrabold text-ink">{video.title}</p>
                    {video.description ? <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-ink/45">{video.description}</p> : null}
                    <p className="mt-1 text-[10px] text-ink/35">{video.category}{video.platform ? ` · ${video.platform}` : ""}</p>
                  </div>
                  {seen ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10.5px] font-bold text-accent"><Check className="h-3 w-3" /> +10 XP</span> : null}
                </div>
                {!active && embed.type === "external" ? (
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-200 hover:text-accent">{locale === "ar" ? "افتح الفيديو" : "Open video"} <ExternalLink className="h-3 w-3" /></a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function TeamStage({ locale }: { locale: Locale }) {
  const { data, finishStage, grantCampaignXp } = useGame();
  const completed = data.campaign.stage > 5;
  const opened = data.campaign.teamOpened ?? [];
  const [active, setActive] = useState<string | null>(opened[0] ?? null);
  const openCard = (slug: string) => {
    setActive(slug); if (opened.includes(slug) || completed) return;
    const next = [...opened, slug];
    if (next.length >= 2 && opened.length < 2) finishStage({ stage: 5, xp: stages[5].xp, coins: stages[5].coins, label: locale === "ar" ? "تعرّفت على الفريق" : "Met the team", patch: { teamOpened: next } });
    else grantCampaignXp(0, "", { teamOpened: next });
  };
  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-[#D0C4AE]">{locale === "ar" ? "افتح بطاقتي الفريق للتعرّف عليهم. البيانات المعروضة حقيقية فقط." : "Open both team cards. Only real, confirmed data is shown."}</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {team.map((member) => {
          const isOpen = opened.includes(member.slug) || active === member.slug;
          return (
            <button key={member.slug} type="button" onClick={() => openCard(member.slug)} className={cn("relative overflow-hidden border p-5 text-start transition", active === member.slug ? "border-[#CBBBA0] bg-[rgba(245,239,226,0.1)]" : "border-[#CBBBA0]/35 bg-[rgba(245,239,226,0.04)] hover:border-[#CBBBA0]/70")}>
              <div aria-hidden className="pointer-events-none absolute inset-2 border border-[#CBBBA0]/20" />
              <div className="flex h-14 w-14 items-center justify-center border border-[#CBBBA0]/40 bg-black/20 text-[#F5EFE2]"><Users className="h-5 w-5" /></div>
              <p className="mt-4 text-[18px] font-black text-[#F5EFE2]" style={{fontFamily:'var(--font-reem),serif'}}>{pick(member.name, locale)}</p>
              <p className="mt-1 text-[11px] font-semibold text-[#CBBBA0]">{pick(member.role, locale)}</p>
              <p className="mt-3 text-[12px] leading-relaxed text-[#D0C4AE]/80">{isOpen ? pick(member.bio, locale) : locale === "ar" ? "اضغط لفتح البطاقة" : "Tap to reveal"}</p>
            </button>
          );
        })}
        <div className="relative border border-dashed border-[#CBBBA0]/35 bg-[rgba(245,239,226,0.03)] p-5">
          <div className="flex h-14 w-14 items-center justify-center border border-[#CBBBA0]/30 text-[#CBBBA0]/60"><Sparkles className="h-5 w-5" /></div>
          <p className="mt-4 text-[18px] font-black text-[#F5EFE2]/80" style={{fontFamily:'var(--font-reem),serif'}}>{locale === "ar" ? "لاعب جديد قريبًا" : "New player coming soon"}</p>
          <p className="mt-2 text-[12px] leading-relaxed text-[#D0C4AE]/65">{locale === "ar" ? "خانة فاضية لعضو جديد — الاسم والدور والنبذة والصورة هتتضاف من ملف الفريق." : "A slot for a new member — name, role, bio, and photo will be added from the team file."}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3"><Reward xp={stages[5].xp} coins={stages[5].coins} locale={locale} /><span className="text-[11px] text-[#CBBBA0]/70">{opened.length}/2 {locale === "ar" ? "بطاقات مفتوحة" : "cards opened"}</span>{completed ? <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFF83F]"><Check className="h-3.5 w-3.5" />{locale === "ar" ? "مكتملة" : "Complete"}</span> : null}</div>
    </div>
  );
}

function Confetti({ motionOn }: { motionOn: boolean }) {
  const pieces = Array.from({ length: 26 });
  if (!motionOn) return null;
  return <div className="pointer-events-none fixed inset-0 z-[75] overflow-hidden" aria-hidden="true">{pieces.map((_, i) => { const left = (i * 37) % 100; const delay = ((i * 13) % 10) / 10; const duration = 2.6 + ((i * 7) % 8) / 10; const color = i % 3 === 0 ? "#2391FF" : i % 3 === 1 ? "#FFF83F" : "#E9F1FF"; return <motion.span key={i} initial={{ y: -40, opacity: 1, rotate: 0 }} animate={{ y: "105vh", rotate: 360 + i * 12, opacity: [1, 1, 0.2] }} transition={{ duration, delay, ease: "easeIn" }} className="absolute top-0 block h-2.5 w-1.5 rounded-sm" style={{ left: `${left}%`, backgroundColor: color }} />; })}</div>;
}

function ResultStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="rounded-xl border border-line bg-white/[0.02] px-3 py-3 text-center"><p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-ink/35">{label}</p><p className={cn("mt-1 text-[18px] font-black", accent ? "text-accent" : "text-ink")}>{value}</p></div>;
}

function buildReport(campaign: { brandName: string; palette: string[]; strategy: string[]; engagement: number; reach: number; clicks: number; sales: number; budget: { meta: number; tiktok: number; google: number } }) {
  const strengths: string[] = [];
  if (campaign.brandName || campaign.palette.length >= 2) strengths.push("identity");
  if (campaign.strategy.length === 4) strengths.push("strategy");
  if ((campaign.engagement || 20) >= 25) strengths.push("community");
  if ((campaign.sales || 0) > 0 || (campaign.clicks || 0) > 0) strengths.push("performance");
  if (Object.values(campaign.budget).some((v) => v > 0)) strengths.push("budget");
  if ((campaign.engagement || 20) >= 35) strengths.push("content");
  if (strengths.length === 0) strengths.push("strategy");
  let serviceSlug = "digital-marketing";
  const engagement = campaign.engagement || 20; const clicks = campaign.clicks || 50; const sales = campaign.sales || 1;
  if (engagement < 30) serviceSlug = "social-media";
  else if (clicks > 0 && sales / Math.max(1, clicks) < 0.02) serviceSlug = "promotion";
  else if (campaign.palette.length < 3 && campaign.brandName) serviceSlug = "branding";
  return { strengthKeys: strengths.slice(0, 3), serviceSlug };
}

export function LaunchStage({ locale }: { locale: Locale }) {
  const { data, finishStage, reset, sound } = useGame();
  const campaign = data.campaign;
  const completed = campaign.stage > 6;
  const [burst, setBurst] = useState(false);
  const neutral = { brandName: campaign.brandName || "", palette: campaign.palette, strategy: campaign.strategy.length === 4 ? campaign.strategy : [], engagement: campaign.engagement || 20, reach: campaign.reach || 2000, clicks: campaign.clicks || 50, sales: campaign.sales || 1, budget: campaign.budget.meta + campaign.budget.tiktok + campaign.budget.google > 0 ? campaign.budget : { meta: 4000, tiktok: 3000, google: 3000 } };
  const hasInputs = campaign.strategy.length || campaign.engagement || campaign.reach || campaign.clicks;
  const report = campaign.report ?? buildReport(hasInputs ? campaign : neutral);
  const service = getService(report.serviceSlug);
  const display = (campaign.engagement || campaign.reach || campaign.clicks) ? campaign : neutral;
  const neu = "bg-[#E4E9F2] shadow-[8px_8px_16px_#C2CCD8,-8px_-8px_16px_#FFFFFF]";
  const neuInset = "bg-[#E4E9F2] shadow-[inset_4px_4px_8px_#C2CCD8,inset_-4px_-4px_8px_#FFFFFF]";
  const launch = () => {
    finishStage({ stage: 6, xp: stages[6].xp, coins: stages[6].coins, label: locale === "ar" ? "تم إطلاق براندك" : "Your brand launched", patch: { report, engagement: display.engagement, reach: display.reach, clicks: display.clicks, sales: display.sales } });
    setBurst(true); sound("level"); window.setTimeout(() => setBurst(false), 3500);
  };

  const shareText = locale === "ar"
    ? ["مرحبًا رَواج! أنهيت حملة رَواج وأحب أشارك تقرير براندي:", `البراند: ${campaign.brandName || "—"}`, `XP: ${data.xp} · عملات: ${data.coins}`, `نقاط القوة: ${(campaign.report?.strengthKeys ?? report.strengthKeys).map((key) => strengthCopy[key]?.ar ?? key).join("، ")}`, `الخدمة المقترحة: ${service?.title.ar ?? ""}`, "أنا جاهز أبدأ مشروعي الحقيقي."].join("\n")
    : ["Hi RAWAJ! I finished the RAWAJ campaign and would love to share my brand report:", `Brand: ${campaign.brandName || "—"}`, `XP: ${data.xp} · Coins: ${data.coins}`, `Strengths: ${(campaign.report?.strengthKeys ?? report.strengthKeys).map((key) => strengthCopy[key]?.en ?? key).join(", ")}`, `Recommended service: ${service?.title.en ?? ""}`, "I'm ready to start my real project."].join("\n");

  return (
    <div>
      <Confetti motionOn={data.motionOn && burst} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className={cn("rounded-[28px] p-6 text-[#24364D]", neu)}>
          {!completed ? (
            <>
              <div className="flex items-center gap-3"><span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl text-[#2391FF]", neuInset)}><Rocket className="h-6 w-6" /></span><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5B708B]">LAUNCH CHECK</p><p className="mt-1 text-[20px] font-black">{locale === "ar" ? "كل حاجة جاهزة للإطلاق؟" : "Everything ready to launch?"}</p></div></div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[ {l:locale==="ar"?"البراند":"Brand",v:campaign.brandName||"—"},{l:locale==="ar"?"التفاعل":"Engagement",v:String(display.engagement),a:true},{l:locale==="ar"?"الوصول":"Reach",v:display.reach.toLocaleString("en-US")},{l:locale==="ar"?"المبيعات":"Sales",v:display.sales.toLocaleString("en-US")}].map(s=><div key={s.l} className={cn("rounded-2xl px-3 py-4 text-center", neuInset)}><p className="text-[10px] font-bold text-[#5B708B]">{s.l}</p><p className={cn("mt-1 text-[20px] font-black",s.a?"text-[#2391FF]":"text-[#24364D]")}>{s.v}</p></div>)}</div>
              <p className="mt-4 text-[12px] leading-relaxed text-[#5B708B]">{locale === "ar" ? "قراراتك (أو قيم افتراضية محايدة لو تخطّيت) هتبني تقرير براندك." : "Your choices (or neutral defaults if you skipped) build your brand report."}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={launch} className="rounded-2xl bg-[#2391FF] px-6 py-3 text-[14px] font-black text-white shadow-[6px_6px_14px_#BFC9D7,-4px_-4px_12px_#FFFFFF]"><Rocket className="me-1 inline h-4 w-4" />{locale === "ar" ? "أطلق براندك" : "Launch your brand"}</button><Reward xp={stages[6].xp} coins={stages[6].coins} locale={locale} /></div>
            </>
          ) : (
            <>
              <div className="text-center"><motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} className={cn("mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-[#2391FF]", neuInset)}><TrophyIcon /></motion.div><h3 className="mt-3 text-[28px] font-black" style={{fontFamily:'var(--font-ibm),sans-serif'}}>{pick(launchCopy.title, locale)}</h3><p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[#5B708B]">{pick(launchCopy.body, locale)}</p></div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[{l:locale==="ar"?"الوصول":"Reach",v:display.reach.toLocaleString("en-US")},{l:locale==="ar"?"النقرات":"Clicks",v:display.clicks.toLocaleString("en-US")},{l:locale==="ar"?"المبيعات":"Sales",v:display.sales.toLocaleString("en-US"),a:true},{l:locale==="ar"?"التفاعل":"Engagement",v:String(display.engagement),a:true}].map(s=><div key={s.l} className={cn("rounded-2xl px-3 py-4 text-center", neuInset)}><p className="text-[10px] font-bold text-[#5B708B]">{s.l}</p><p className={cn("mt-1 text-[20px] font-black",s.a?"text-[#2391FF]":"text-[#24364D]")}>{s.v}</p></div>)}</div>
              <div className={cn("mt-5 rounded-2xl p-5", neuInset)}><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5B708B]">{pick(launchCopy.reportTitle, locale)}</p><div className="mt-3 grid gap-4 sm:grid-cols-2"><div><p className="text-[11px] font-bold text-[#5B708B]">{pick(launchCopy.strengths, locale)}</p><ul className="mt-2 space-y-1.5">{(campaign.report?.strengthKeys ?? report.strengthKeys).map((key) => (<li key={key} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#24364D]"><Check className="h-3.5 w-3.5 shrink-0 text-[#2391FF]" />{strengthCopy[key] ? pick(strengthCopy[key], locale) : key}</li>))}</ul></div><div><p className="text-[11px] font-bold text-[#5B708B]">{pick(launchCopy.recommended, locale)}</p><p className="mt-1 text-[16px] font-black text-[#2391FF]">{service ? pick(service.title, locale) : "—"}</p><p className="mt-1 text-[11px] leading-relaxed text-[#5B708B]">{report.serviceSlug && reportServiceReason[report.serviceSlug] ? pick(reportServiceReason[report.serviceSlug], locale) : ""}</p></div></div></div>
              <div className="mt-4 flex flex-wrap items-center gap-3"><a href={whatsappHref(siteConfig.whatsapp, shareText)} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#2391FF] px-5 py-3 text-[12.5px] font-black text-white shadow-[6px_6px_14px_#BFC9D7,-4px_-4px_12px_#FFFFFF]">{pick(launchCopy.share, locale)} <ExternalLink className="ms-1 inline h-3.5 w-3.5" /></a><button type="button" onClick={() => { reset(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={cn("rounded-2xl px-4 py-3 text-[11.5px] font-bold text-[#5B708B]", neu)}>{pick(launchCopy.replay, locale)}</button></div>
              <p className="mt-3 text-[10px] leading-relaxed text-[#5B708B]/80">{pick(launchCopy.liability, locale)}</p>
            </>
          )}
        </div>
        <aside className="space-y-3"><div className={cn("rounded-[24px] p-5 text-[#24364D]", neu)}><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5B708B]">{locale === "ar" ? "المرحلة التالية" : "NEXT STAGE"}</p><p className="mt-2 text-[18px] font-black">{pick(stages[7].title, locale)}</p><p className="mt-1 text-[12px] leading-relaxed text-[#5B708B]">{pick(stages[7].tagline, locale)}</p><a href="#boss" className="mt-4 block rounded-2xl bg-[#2391FF] px-4 py-3 text-center text-[12px] font-black text-white">{pick(launchCopy.boss, locale)}</a></div><div className={cn("rounded-[24px] p-5 text-[#24364D]", neuInset)}><p className="flex items-center gap-1.5 text-[12px] font-bold"><ShieldCheck className="h-4 w-4 text-[#2391FF]" />{locale === "ar" ? "بدون ادعاءات" : "No fake claims"}</p><p className="mt-2 text-[11px] leading-relaxed text-[#5B708B]">{locale === "ar" ? "كل الأرقام هنا تقديرية/تعليمية وليست نتائج حملات حقيقية." : "All numbers here are educational estimates, not real campaign results."}</p></div></aside>
      </div>
    </div>
  );
}

function TrophyIcon() { return <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true"><path d="M7 4h10v5a5 5 0 0 1-10 0V4Zm-3 1h3v3a3 3 0 0 1-3-3Zm13 0h3a3 3 0 0 1-3 3V5ZM10 18h4m-2-4v4m-3 4h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }

export function BossStage({ locale }: { locale: Locale }) {
  const { data, finishStage } = useGame();
  const done = data.campaign.bossDone;
  const campaign = data.campaign;
  const report = campaign.report ?? buildReport(campaign);
  const service = getService(report.serviceSlug);
  const shareText = locale === "ar"
    ? ["مرحبًا رَواج! أنهيت حملة رَواج وأحب أشارك تقرير براندي:", `البراند: ${campaign.brandName || "—"}`, `نقاط القوة: ${report.strengthKeys.map((k) => strengthCopy[k]?.ar ?? k).join("، ")}`, `الخدمة المقترحة: ${service?.title.ar ?? ""}`, "جاهز أبدأ مشروعي الحقيقي."].join("\n")
    : ["Hi RAWAJ! I finished the RAWAJ campaign and want to share my brand report:", `Brand: ${campaign.brandName || "—"}`, `Strengths: ${report.strengthKeys.map((k) => strengthCopy[k]?.en ?? k).join(", ")}`, `Recommended: ${service?.title.en ?? ""}`, "Ready to start my real project."].join("\n");
  const confirm = () => { if (done) return; finishStage({ stage: 7, xp: stages[7].xp, coins: stages[7].coins, label: locale === "ar" ? "وصلت للبوس ليفل" : "Boss level reached", patch: { bossDone: true } }); };
  const mapQuery = encodeURIComponent(locale === "ar" ? "شبين الكوم، المنوفية، مصر" : "Shebin El-Kom, Menoufia, Egypt");
  return (
    <div className="relative overflow-hidden rounded-[28px] border-4 border-[#2391FF]/50 bg-[#07162D] p-5 text-[#EAF4FF] shadow-[0_0_0_2px_#2391FF,0_0_40px_rgba(35,145,255,.2)] sm:p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,198,255,.35),transparent_35%),linear-gradient(180deg,rgba(7,22,45,.1),#07162D_60%)]" />
      <div aria-hidden className="pointer-events-none absolute start-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#7CC6FF]/80 via-[#2391FF]/20 to-transparent" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="font-pixel text-[9px] uppercase tracking-[0.2em] text-[#7CC6FF]">BOSS LEVEL</p>
          <h3 className="mt-3 font-display text-[clamp(2.2rem,6vw,4.8rem)] leading-none text-[#EAF4FF]" style={{ textShadow: "0 0 18px rgba(35,145,255,.55), 4px 4px 0 #041022" }}>{locale === "ar" ? "ابدأ؟" : "START?"}</h3>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-[#C7DCF4]">{locale === "ar" ? "كل قرار خدته بيرجّعك لسؤال: مين ينفّذ؟ رَواج بتنفّذ الشغل ده على أرض الواقع. ابدأ بمكالمة أو رسالة." : "Every decision leads to one question: who executes it? RAWAJ does this in real life. Start with a call or a message."}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={`tel:${siteConfig.phone}`} onClick={confirm} className="flex items-center justify-between border-2 border-[#7CC6FF] bg-[#0A1C38] px-4 py-3 text-[13px] font-black text-[#EAF4FF] shadow-[0_0_18px_rgba(35,145,255,.2)] hover:bg-[#102A52]"><span>{locale === "ar" ? "اتصال مباشر" : "Call now"}</span><span dir="ltr" className="text-[11px] text-[#9FC0E6]">{siteConfig.phone}</span></a>
            <a href={whatsappHref(siteConfig.whatsapp, shareText)} onClick={confirm} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border-2 border-[#FFF83F] bg-[#FFF83F] px-4 py-3 text-[13px] font-black text-[#041022] hover:bg-[#FFF96A]"><span>{locale === "ar" ? "ابعتلنا التقرير على واتساب" : "Send report on WhatsApp"}</span><span dir="ltr" className="text-[11px] opacity-70">01024345291</span></a>
            <a href={`mailto:${siteConfig.email}`} onClick={confirm} className="flex items-center justify-between gap-2 border-2 border-[#2391FF]/60 bg-[#0A1C38] px-4 py-3 text-[13px] font-bold hover:border-[#7CC6FF]"><span>{locale === "ar" ? "إيميل" : "Email"}</span><span dir="ltr" className="text-[10px] text-[#9FC0E6]">{siteConfig.email.toLowerCase()}</span></a>
            <a href={`/${locale}/contact`} onClick={confirm} className="flex items-center justify-between border-2 border-[#2391FF] bg-[#2391FF]/10 px-4 py-3 text-[13px] font-bold text-[#7CC6FF] hover:bg-[#2391FF]/20"><span>{locale === "ar" ? "صفحة التواصل" : "Contact page"}</span><ChevronLeft className="h-4 w-4 rtl:block ltr:hidden" /><ChevronRight className="h-4 w-4 ltr:block rtl:hidden" /></a>
          </div>
          <p className="mt-4 text-[11px] text-[#9FC0E6]">{done ? (locale === "ar" ? "وصلت للبوس ليفل ✓ (+30 XP)" : "Boss level reached ✓ (+30 XP)") : (locale === "ar" ? "أول ضغطة تواصل تمنح +30 XP" : "First contact tap grants +30 XP")}</p>
        </div>
        <aside className="space-y-3">
          <div className="border-2 border-[#2391FF]/40 bg-[#0A1C38]/80 p-4"><p className="flex items-center gap-1.5 text-[12px] font-bold text-[#9FC0E6]"><ShieldCheck className="h-4 w-4 text-[#FFF83F]" />{locale === "ar" ? "المقر" : "Location"}</p><p className="mt-2 text-[14px] font-black">{locale === "ar" ? "شبين الكوم، المنوفية، مصر" : "Shebin El-Kom, Menoufia, Egypt"}</p><a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#7CC6FF] hover:text-[#FFF83F]"><ExternalLink className="h-3.5 w-3.5" />{locale === "ar" ? "افتح الخريطة" : "Open the map"}</a></div>
          <div className="border-2 border-[#2391FF]/40 bg-[#0A1C38]/80 p-4"><p className="font-pixel text-[8px] text-[#7CC6FF]">PLAYER FILE</p><p className="mt-2 text-[14px] font-black">{data.campaign.brandName || (locale === "ar" ? "بدون اسم بعد" : "No brand yet")}</p><p className="mt-1 text-[12px] text-[#9FC0E6]">{data.xp} XP · {data.coins} {locale === "ar" ? "عملة" : "coins"}</p></div>
        </aside>
      </div>
    </div>
  );
}

export function ServiceReveal({ slug, locale }: { slug: string; locale: Locale }) {
  const service = getService(slug);
  if (!service) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/[0.06] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-pixel text-[8px] uppercase tracking-[0.14em] text-brand-200">{locale === "ar" ? "خدمة مفتوحة" : "SERVICE UNLOCKED"}</p>
        <a href={`/${locale}/services/${service.slug}`} className="inline-flex items-center gap-1 text-[11.5px] font-bold text-accent transition hover:text-brand-200">{locale === "ar" ? "تفاصيل الخدمة" : "Service details"} <ExternalLink className="h-3 w-3" /></a>
      </div>
      <h3 className="mt-2 text-[18px] font-black text-ink">{pick(service.title, locale)}</h3>
      <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink/55">{pick(service.intro, locale)}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {service.features[locale].map((feature) => (<li key={feature.title} className="rounded-xl border border-line bg-abyss/40 p-3"><p className="text-[11.5px] font-extrabold text-ink/80">{feature.title}</p><p className="mt-1 text-[10.5px] leading-relaxed text-ink/40">{feature.body}</p></li>))}
      </ul>
    </motion.div>
  );
}