export type ReplayVideoRow = {
  id: string;
  url: string;
  platform?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  thumbnail_url?: string | null;
  category?: string | null;
  orientation?: string | null;
  service_slug?: string | null;
  sort_order?: number | null;
  published?: boolean | null;
  visible?: boolean | null;
};

export type ChannelRow = {
  id: string;
  url: string;
  platform?: string | null;
  name?: string | null;
  description?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  latest_posts?: any;
  stats?: any;
  stats_source?: string | null;
  is_real_stats?: boolean | null;
  last_fetched_at?: string | null;
  fetch_status?: string | null;
  fetch_error?: string | null;
  linked_service_slug?: string | null;
  linked_stage?: string | null;
  sort_order?: number | null;
  published?: boolean | null;
  visible?: boolean | null;
};

export const REPLAY_CATEGORIES = [
  "Promo films",
  "Reels and short-form edits",
  "Long-form video",
  "Motion graphics",
  "AI-assisted projects",
] as const;