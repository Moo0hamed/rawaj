import { type NextRequest, NextResponse } from "next/server";

// Fetch oEmbed/Open Graph metadata for a URL (admin preview). Server-side to avoid CORS.
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url required" }, { status: 400 });
    }
    const meta = await fetchLinkMeta(url.trim());
    return NextResponse.json(meta);
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

function detectPlatform(url: string): string {
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^www\./, "");
    if (h.includes("youtube.com") || h === "youtu.be") return "youtube";
    if (h.includes("vimeo.com")) return "vimeo";
    if (h.includes("facebook.com") || h === "fb.watch") return "facebook";
    if (h.includes("tiktok.com")) return "tiktok";
    if (h.includes("instagram.com")) return "instagram";
    if (h.includes("drive.google.com")) return "drive";
    if (/\.(mp4|webm|m3u8)(\?|$)/i.test(u.pathname)) return "mp4";
  } catch {}
  return "other";
}

async function fetchLinkMeta(url: string) {
  const platform = detectPlatform(url);
  const out: Record<string, string> = { platform, title: "", thumbnail: "", provider: platform, description: "" };
  const oembed = await tryOEmbed(url, platform);
  if (oembed) {
    out.title = (oembed.title as string) || out.title;
    out.thumbnail = (oembed.thumbnail_url as string) || out.thumbnail;
    out.provider = (oembed.provider_name as string) || platform;
  }
  if (!out.title || !out.thumbnail) {
    const og = await tryOpenGraph(url);
    if (!out.title && og.title) out.title = og.title;
    if (!out.thumbnail && og.image) out.thumbnail = og.image;
    if (!out.description && og.description) out.description = og.description;
  }
  if (platform === "youtube" && !out.thumbnail) {
    const id = extractYouTubeId(url);
    if (id) out.thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }
  return out;
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const m = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    if (m) return m[2];
  } catch {}
  return null;
}

async function tryOEmbed(url: string, platform: string): Promise<Record<string, unknown> | null> {
  const endpoints: Record<string, string> = {
    youtube: `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    vimeo: `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
    tiktok: `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
  };
  const ep = endpoints[platform];
  if (!ep) return null;
  try {
    const res = await fetch(ep, { headers: { "User-Agent": "RAWAJ-bot/1.0" } });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch { return null; }
}

async function tryOpenGraph(url: string): Promise<{ title?: string; image?: string; description?: string }> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "RAWAJ-bot/1.0" },
      redirect: "follow",
    });
    if (!res.ok) return {};
    const html = await res.text();
    const get = (prop: string) => {
      const re = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
      const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, "i");
      return (html.match(re) || html.match(re2) || [null, ""])[1] || "";
    };
    const title = get("og:title") || (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [null, ""])[1] || "";
    const image = get("og:image");
    const description = get("og:description") || get("description");
    return { title: decodeHtml(title), image, description: decodeHtml(description) };
  } catch { return {}; }
}

function decodeHtml(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}