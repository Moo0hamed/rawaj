"use client";

import { ExternalLink, Youtube, Instagram, Facebook, Music, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChannelRow } from "@/lib/cms/types";
import { pick, type Locale } from "@/lib/i18n";

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music,
};

export function ChannelCard({ channel, locale }: { channel: ChannelRow; locale: Locale }) {
  const platform = (channel.platform || "").toLowerCase();
  const Icon = PLATFORM_ICONS[platform] || ExternalLink;
  const isReal = channel.is_real_stats;
  const stats = channel.stats || {};
  const followers = stats.followers ? Number(stats.followers).toLocaleString() : "—";
  const views = stats.views ? Number(stats.views).toLocaleString() : "—";
  const posts = stats.posts ? Number(stats.posts).toLocaleString() : "—";
  const lastFetched = channel.last_fetched_at ? new Date(channel.last_fetched_at).toLocaleString(locale === "ar" ? "ar-EG" : "en-US") : "—";
  const fetchStatus = channel.fetch_status || "pending";

  return (
    <article className="relative overflow-hidden rounded-2xl border border-line bg-surface p-5 transition hover:border-brand-400/50">
      <div className="flex items-start gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-500/15">
          {channel.avatar_url ? (
            <img src={channel.avatar_url} alt="" className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <Icon className="h-8 w-8 text-brand-200" />
          )}
          {isReal && (
            <span className="absolute -bottom-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[9px] font-black">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[15px] font-extrabold text-ink">{channel.name || channel.url}</h3>
            <span className="shrink-0 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-bold text-brand-200 uppercase">{platform}</span>
          </div>
          <p className="mt-1 truncate text-[12px] text-ink/50">{channel.url}</p>
          {channel.description && <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-ink/50">{channel.description}</p>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-line bg-white/[0.02] p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink/40">{locale === "ar" ? "متابعين" : "Followers"}</p>
          <p className="mt-1 text-[16px] font-black text-ink">{followers}</p>
        </div>
        <div className="rounded-xl border border-line bg-white/[0.02] p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink/40">{locale === "ar" ? "مشاهدات" : "Views"}</p>
          <p className="mt-1 text-[16px] font-black text-ink">{views}</p>
        </div>
        <div className="rounded-xl border border-line bg-white/[0.02] p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink/40">{locale === "ar" ? "منشورات" : "Posts"}</p>
          <p className="mt-1 text-[16px] font-black text-ink">{posts}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-ink/50">
          <span className="font-semibold">{locale === "ar" ? "المصدر: " : "Source: "}</span>
          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", isReal ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300")}>
            {isReal ? (locale === "ar" ? "أرقام حقيقية" : "Real stats") : (locale === "ar" ? "يدوي/تقديري" : "Manual/Est.")}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-ink/40">
          <span>{locale === "ar" ? "آخر تحديث: " : "Last updated: "}</span>
          <span>{lastFetched}</span>
          {fetchStatus === "error" && channel.fetch_error && (
            <span className="flex items-center gap-1 text-red-300">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-[10px]">{channel.fetch_error}</span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-line flex flex-wrap gap-2">
        <a href={channel.url} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12px] font-bold text-ink/70 hover:border-brand-400/50 hover:text-ink">
          <ExternalLink className="h-3.5 w-3.5" />
          {locale === "ar" ? "افتح القناة" : "Open channel"}
        </a>
        {channel.linked_service_slug && (
          <a href={`/${locale}/services/${channel.linked_service_slug}`} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-400/50 bg-brand-500/10 px-3 py-2 text-[12px] font-bold text-brand-200 hover:bg-brand-500 hover:text-white">
            {locale === "ar" ? "الخدمة المرتبطة" : "Linked service"}
          </a>
        )}
      </div>
    </article>
  );
}