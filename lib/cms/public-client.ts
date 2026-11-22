import { createClient as createBrowser, isSupabaseConfigured as browserConfigured } from "@/lib/supabase/browser";
import type { ReplayVideoRow, ChannelRow } from "./types";

export async function fetchPublishedVideosClient(): Promise<ReplayVideoRow[]> {
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
  if (error || !data) return [];
  return data as ReplayVideoRow[];
}

export async function fetchPublishedChannelsClient(): Promise<ChannelRow[]> {
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
  if (error || !data) return [];
  return data as ChannelRow[];
}