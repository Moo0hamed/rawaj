export type EmbedInfo =
  | { type: "youtube" | "vimeo"; src: string }
  | { type: "mp4"; src: string }
  | { type: "external"; src: string };

function ytId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const m = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    return m ? m[2] : null;
  } catch { return null; }
}

function vimeoId(url: string): string | null {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/(\d+)/);
    return m ? m[1] : null;
  } catch { return null; }
}

export function getEmbedInfo(url: string, platform?: string | null): EmbedInfo {
  const p = (platform || "").toLowerCase();
  try {
    const u = new URL(url);
    if (p === "youtube" || u.hostname.includes("youtube") || u.hostname === "youtu.be") {
      const id = ytId(url);
      if (id) return { type: "youtube", src: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` };
    }
    if (p === "vimeo" || u.hostname.includes("vimeo.com")) {
      const id = vimeoId(url);
      if (id) return { type: "vimeo", src: `https://player.vimeo.com/video/${id}` };
    }
    if (p === "mp4" || /\.(mp4|webm)(\?|$)/i.test(u.pathname)) return { type: "mp4", src: url };
  } catch {}
  return { type: "external", src: url };
}