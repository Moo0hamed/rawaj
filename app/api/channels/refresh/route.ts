import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const META_API_KEY = process.env.META_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    // Check auth - only admin can trigger refresh
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    // Get all channels that need refresh
    const { data: channels, error: fetchError } = await supabase
      .from("channels")
      .select("id, url, platform, name, description, avatar_url, cover_url, stats, stats_source, is_real_stats")
      .eq("visible", true);

    if (fetchError || !channels || channels.length === 0) {
      return NextResponse.json({ error: "No channels to refresh", refreshed: 0 });
    }

    let refreshed = 0;
    const errors: string[] = [];

    for (const channel of channels) {
      try {
        const meta = await fetchLinkMeta(channel.url, channel.platform);
        if (meta) {
          const updateData: any = {
            name: meta.title || channel.name,
            description: meta.description || channel.description,
            avatar_url: meta.thumbnail || channel.avatar_url,
            cover_url: meta.cover_url || channel.cover_url,
            stats_source: meta.stats_source || "og_oembed",
            is_real_stats: !!meta.stats_source,
            last_fetched_at: new Date().toISOString(),
            fetch_status: "ok",
            fetch_error: null,
            updated_at: new Date().toISOString(),
          };

          // Update stats if available
          if (meta.stats) {
            updateData.stats = { ...(channel.stats || {}), ...meta.stats };
          }

          const { error: updateError } = await supabase
            .from("channels")
            .update(updateData)
            .eq("id", channel.id);

          if (updateError) {
            errors.push(`${channel.url}: ${updateError.message}`);
          } else {
            refreshed++;
          }
        }
      } catch (e: any) {
        errors.push(`${channel.url}: ${e.message}`);
        // Update fetch status
        await supabase
          .from("channels")
          .update({
            fetch_status: "error",
            fetch_error: e.message,
            last_fetched_at: new Date().toISOString(),
          })
          .eq("id", channel.id);
      }
    }

    return NextResponse.json({ refreshed, errors: errors.length > 0 ? errors : undefined });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}

async function fetchLinkMeta(url: string, platform?: string | null) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      headers: { "User-Agent": "RAWAJ Bot/1.0 (+https://rawaj.agency)" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const html = await res.text();
    const meta: any = { url };

    // Extract Open Graph tags
    const ogTitle = extractMeta(html, "og:title");
    const ogDescription = extractMeta(html, "og:description");
    const ogImage = extractMeta(html, "og:image");
    const ogUrl = extractMeta(html, "og:url");
    const ogType = extractMeta(html, "og:type");

    // Extract Twitter Card
    const twitterTitle = extractMeta(html, "twitter:title");
    const twitterDescription = extractMeta(html, "twitter:description");
    const twitterImage = extractMeta(html, "twitter:image");

    // Extract oEmbed (for YouTube, etc.)
    let oembedData = null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      try {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (oembedRes.ok) oembedData = await oembedRes.json();
      } catch {}
    }

    // Meta Graph API for Facebook/Instagram pages (if token available)
    let metaGraphData = null;
    if (META_API_KEY && (platform === "facebook" || platform === "instagram" || url.includes("facebook.com") || url.includes("instagram.com"))) {
      try {
        // Extract username/page ID from URL
        const username = extractUsernameFromUrl(url, platform);
        if (username) {
          const graphUrl = `https://graph.facebook.com/v19.0/${username}?fields=id,name,description,followers_count,media_count,profile_picture_url,cover_photo_url&access_token=${META_API_KEY}`;
          const graphRes = await fetch(graphUrl);
          if (graphRes.ok) {
            metaGraphData = await graphRes.json();
          }
        }
      } catch {}
    }

    meta.title = ogTitle || twitterTitle || oembedData?.title || metaGraphData?.name || extractTitle(html);
    meta.description = ogDescription || twitterDescription || oembedData?.description || metaGraphData?.description || extractDescription(html);
    meta.thumbnail = ogImage || twitterImage || oembedData?.thumbnail_url || metaGraphData?.profile_picture_url;
    meta.cover_url = meta.thumbnail || metaGraphData?.cover_photo_url;
    meta.stats_source = metaGraphData ? "meta_graph_api" : (oembedData ? "official_api" : (ogTitle ? "og_oembed" : "manual"));

    // Stats from Meta Graph API
    if (metaGraphData) {
      meta.stats = {
        followers: metaGraphData.followers_count,
        posts: metaGraphData.media_count,
        // views not directly available from Graph API without insights permission
      };
    }

    // Try to extract stats from meta tags or JSON-LD
    const stats = extractStats(html, url);
    if (Object.keys(stats).length > 0) {
      meta.stats = { ...(meta.stats || {}), ...stats };
    }

    return meta;
  } catch {
    return null;
  }
}

function extractUsernameFromUrl(url: string, platform?: string | null): string | null {
  try {
    const u = new URL(url);
    const pathParts = u.pathname.split("/").filter(Boolean);
    
    if (platform === "instagram" || u.hostname.includes("instagram.com")) {
      // Instagram: instagram.com/username/
      return pathParts[0] || null;
    }
    if (platform === "facebook" || u.hostname.includes("facebook.com")) {
      // Facebook: facebook.com/username or facebook.com/pages/name/id
      if (pathParts[0] === "pages" && pathParts.length >= 2) {
        return pathParts[1]; // page name
      }
      return pathParts[0] || null;
    }
    // Fallback: first path segment
    return pathParts[0] || null;
  } catch {
    return null;
  }
}

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractDescription(html: string): string | null {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function extractStats(html: string, url: string): Record<string, any> {
  const stats: Record<string, any> = {};

  // Try to find subscriber/follower counts in JSON-LD
  const jsonLdMatches = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonLdMatches) {
    for (const match of jsonLdMatches) {
      try {
        const json = JSON.parse(match.replace(/<script[^>]*>|<\/script>/gi, ""));
        if (json["@type"] === "Person" || json["@type"] === "Organization" || json["@type"] === "SocialMediaProfile") {
          if (json.interactionStatistic) {
            for (const stat of Array.isArray(json.interactionStatistic) ? json.interactionStatistic : [json.interactionStatistic]) {
              if (stat["@type"] === "InteractionCounter") {
                const name = stat.interactionService?.name || stat.name;
                const count = stat.userInteractionCount;
                if (name && count) stats[name.toLowerCase()] = parseInt(count, 10);
              }
            }
          }
        }
      } catch {}
    }
  }

  // Platform-specific meta tags
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const subMatch = html.match(/<meta[^>]+itemprop=["']subscriberCount["'][^>]+content=["']([^"']+)["']/i);
    if (subMatch) stats.followers = parseInt(subMatch[1], 10);
    const viewMatch = html.match(/<meta[^>]+itemprop=["']interactionCount["'][^>]+content=["']([^"']+)["']/i);
    if (viewMatch) stats.views = parseInt(viewMatch[1], 10);
  }

  return stats;
}