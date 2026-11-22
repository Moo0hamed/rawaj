import { createClient as createBrowser, isSupabaseConfigured as browserConfigured } from "@/lib/supabase/browser";
import type { ReplayVideoRow, ChannelRow, ContentItemRow } from "./types";
import { stages, palette, strategySteps, contentItems as socialItems, adsChannels, identityCopy, strategyCopy, socialCopy, adsCopy, launchCopy, strengthCopy, mascotLines, mascotByIdle, prankCopy, reportServiceReason } from "@/content/campaign";
import { services } from "@/content/services";
import { team } from "@/content/team";
import { plans as pricingPlans, faqs } from "@/content/pricing";
import { projects } from "@/content/projects";
import { industries } from "@/content/industries";
import { testimonials } from "@/content/testimonials";
import { siteConfig } from "@/content/site";
import { getDictionary } from "@/content/dictionaries";
import type { Dictionary } from "@/content/dictionaries";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; ts: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T;
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, ts: Date.now() });
}

function clearCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}

function getLocalDict(): Dictionary {
  try { return getDictionary("ar"); } catch { return getDictionary("ar"); }
}

export async function fetchContentItemsClient(kind: string): Promise<ContentItemRow[]> {
  const cacheKey = `content_items:${kind}`;
  const cached = getCached<ContentItemRow[]>(cacheKey);
  if (cached) return cached;

  if (!browserConfigured()) {
    const fallback = getLocalContentFallback(kind);
    setCache(cacheKey, fallback);
    return fallback;
  }

  const supabase = createBrowser();
  if (!supabase) {
    const fallback = getLocalContentFallback(kind);
    setCache(cacheKey, fallback);
    return fallback;
  }

  const { data, error } = await supabase
    .from("content_items")
    .select("id,kind,slug,sort_order,published,visible,data,created_at,updated_at")
    .eq("kind", kind)
    .eq("published", true)
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    const fallback = getLocalContentFallback(kind);
    setCache(cacheKey, fallback);
    return fallback;
  }

  const result = data as ContentItemRow[];
  setCache(cacheKey, result);
  return result;
}

function getLocalContentFallback(kind: string): ContentItemRow[] {
  const dict = getLocalDict();
  const now = new Date().toISOString();

  const map: Record<string, ContentItemRow[]> = {
    stage: stages.map((s, i) => ({ id: crypto.randomUUID(), kind: 'stage', slug: s.id, sort_order: i, published: true, visible: true, data: s, created_at: now, updated_at: now })),
    palette: palette.map((p, i) => ({ id: crypto.randomUUID(), kind: 'palette', slug: p.hex.replace('#',''), sort_order: i, published: true, visible: true, data: p, created_at: now, updated_at: now })),
    strategy_step: strategySteps.map((s, i) => ({ id: crypto.randomUUID(), kind: 'strategy_step', slug: s.id, sort_order: i, published: true, visible: true, data: s, created_at: now, updated_at: now })),
    social_content: socialItems.map((s, i) => ({ id: crypto.randomUUID(), kind: 'social_content', slug: s.id, sort_order: i, published: true, visible: true, data: s, created_at: now, updated_at: now })),
    ads_channel: adsChannels.map((c, i) => ({ id: crypto.randomUUID(), kind: 'ads_channel', slug: c.id, sort_order: i, published: true, visible: true, data: c, created_at: now, updated_at: now })),
    copy: [
      { slug: 'identity', data: identityCopy },
      { slug: 'strategy', data: strategyCopy },
      { slug: 'social', data: socialCopy },
      { slug: 'ads', data: adsCopy },
      { slug: 'launch', data: launchCopy },
      { slug: 'prank', data: prankCopy },
    ].map((c, i) => ({ id: crypto.randomUUID(), kind: 'copy', slug: c.slug, sort_order: i, published: true, visible: true, data: c.data, created_at: now, updated_at: now })),
    strength: Object.entries(strengthCopy).map(([k, v], i) => ({ id: crypto.randomUUID(), kind: 'strength', slug: k, sort_order: i, published: true, visible: true, data: v, created_at: now, updated_at: now })),
    report_reason: Object.entries(reportServiceReason).map(([k, v], i) => ({ id: crypto.randomUUID(), kind: 'report_reason', slug: k, sort_order: i, published: true, visible: true, data: v, created_at: now, updated_at: now })),
    mascot_lines: Object.entries(mascotLines).map(([k, v], i) => ({ id: crypto.randomUUID(), kind: 'mascot_lines', slug: k, sort_order: i, published: true, visible: true, data: { lines: v }, created_at: now, updated_at: now })),
    dict: [
      { slug: 'meta', data: { ar: dict.meta, en: getDictionary('en').meta } },
      { slug: 'nav', data: { ar: dict.nav, en: getDictionary('en').nav } },
      { slug: 'common', data: { ar: dict.common, en: getDictionary('en').common } },
      { slug: 'hero', data: { ar: dict.hero, en: getDictionary('en').hero } },
      { slug: 'stats', data: { ar: dict.stats, en: getDictionary('en').stats } },
      { slug: 'homeAbout', data: { ar: dict.homeAbout, en: getDictionary('en').homeAbout } },
      { slug: 'servicesSection', data: { ar: dict.servicesSection, en: getDictionary('en').servicesSection } },
      { slug: 'industriesSection', data: { ar: dict.industriesSection, en: getDictionary('en').industriesSection } },
      { slug: 'processSection', data: { ar: dict.processSection, en: getDictionary('en').processSection } },
      { slug: 'workSection', data: { ar: dict.workSection, en: getDictionary('en').workSection } },
      { slug: 'teamSection', data: { ar: dict.teamSection, en: getDictionary('en').teamSection } },
      { slug: 'clientsSection', data: { ar: dict.clientsSection, en: getDictionary('en').clientsSection } },
      { slug: 'testimonialsSection', data: { ar: dict.testimonialsSection, en: getDictionary('en').testimonialsSection } },
      { slug: 'pricingSection', data: { ar: dict.pricingSection, en: getDictionary('en').pricingSection } },
      { slug: 'contactCta', data: { ar: dict.contactCta, en: getDictionary('en').contactCta } },
      { slug: 'aboutPage', data: { ar: dict.aboutPage, en: getDictionary('en').aboutPage } },
      { slug: 'servicesPage', data: { ar: dict.servicesPage, en: getDictionary('en').servicesPage } },
      { slug: 'workPage', data: { ar: dict.workPage, en: getDictionary('en').workPage } },
      { slug: 'teamPage', data: { ar: dict.teamPage, en: getDictionary('en').teamPage } },
      { slug: 'contactPage', data: { ar: dict.contactPage, en: getDictionary('en').contactPage } },
      { slug: 'footer', data: { ar: dict.footer, en: getDictionary('en').footer } },
      { slug: 'notFound', data: { ar: dict.notFound, en: getDictionary('en').notFound } },
      { slug: 'labels', data: { ar: dict.labels, en: getDictionary('en').labels } },
    ].map((d, i) => ({ id: crypto.randomUUID(), kind: 'dict', slug: d.slug, sort_order: i, published: true, visible: true, data: d.data, created_at: now, updated_at: now })),
    service: services.map((s, i) => ({ id: crypto.randomUUID(), kind: 'service', slug: s.slug, sort_order: i, published: true, visible: true, data: s, created_at: now, updated_at: now })),
    team: team.map((t, i) => ({ id: crypto.randomUUID(), kind: 'team', slug: t.slug, sort_order: i, published: true, visible: true, data: t, created_at: now, updated_at: now })),
    pricing: pricingPlans.map((p, i) => ({ id: crypto.randomUUID(), kind: 'pricing', slug: p.slug, sort_order: i, published: true, visible: true, data: p, created_at: now, updated_at: now })),
    project: projects.map((p, i) => ({ id: crypto.randomUUID(), kind: 'project', slug: p.slug, sort_order: i, published: false, visible: false, data: p, created_at: now, updated_at: now })),
    industry: industries.map((ind, i) => ({ id: crypto.randomUUID(), kind: 'industry', slug: ind.slug, sort_order: i, published: true, visible: true, data: ind, created_at: now, updated_at: now })),
    testimonial: (testimonials as any[]).map((t, i) => ({ id: crypto.randomUUID(), kind: 'testimonial', slug: t.slug || t.id || `testimonial-${i}`, sort_order: i, published: true, visible: true, data: t, created_at: now, updated_at: now })),
    faq: faqs.map((f: any, i) => ({ id: crypto.randomUUID(), kind: 'faq', slug: f.slug || `faq-${i}`, sort_order: i, published: true, visible: true, data: f, created_at: now, updated_at: now })),
  };

  return map[kind] || [];
}

export async function fetchSiteSettingsClient() {
  const cacheKey = 'site_settings';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (!browserConfigured()) return siteConfig;

  const supabase = createBrowser();
  if (!supabase) return siteConfig;

  const { data, error } = await supabase
    .from("site_settings")
    .select("data")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data?.data) {
    setCache(cacheKey, siteConfig);
    return siteConfig;
  }

  const result = { ...siteConfig, ...(data.data as any) };
  setCache(cacheKey, result);
  return result;
}

export async function fetchPublishedVideosClient(): Promise<ReplayVideoRow[]> {
  const cacheKey = 'replay_videos';
  const cached = getCached<ReplayVideoRow[]>(cacheKey);
  if (cached) return cached;

  if (!browserConfigured()) return [];

  const supabase = createBrowser();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("replay_videos")
    .select("id,url,platform,title_ar,title_en,description_ar,description_en,thumbnail_url,category,orientation,service_slug,sort_order,published,visible")
    .eq("published", true)
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    setCache(cacheKey, []);
    return [];
  }

  const result = data as ReplayVideoRow[];
  setCache(cacheKey, result);
  return result;
}

export async function fetchPublishedChannelsClient(): Promise<ChannelRow[]> {
  const cacheKey = 'channels';
  const cached = getCached<ChannelRow[]>(cacheKey);
  if (cached) return cached;

  if (!browserConfigured()) return [];

  const supabase = createBrowser();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("channels")
    .select("id,url,platform,name,description,avatar_url,cover_url,latest_posts,stats,stats_source,is_real_stats,last_fetched_at,fetch_status,fetch_error,linked_service_slug,linked_stage,sort_order,published,visible")
    .eq("published", true)
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    setCache(cacheKey, []);
    return [];
  }

  const result = data as ChannelRow[];
  setCache(cacheKey, result);
  return result;
}

export function clearContentCache(key?: string) {
  clearCache(key);
}

export function useContentCache() {
  return { clearContentCache };
}