"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGame } from "@/components/game/GameProvider";
import { THEMES, themeForStage, themeVars, type ThemeId } from "@/lib/themes";

function resolveThemeId(pathname: string, campaignView: number): ThemeId {
  if (pathname.includes("/admin")) return "admin";
  if (pathname.includes("/contact")) return "contact";
  if (pathname.includes("/play")) return "home";
  if (pathname.includes("/campaign") || /\/(ar|en)\/?$/.test(pathname)) return themeForStage(campaignView);
  if (pathname.includes("/team")) return "team";
  if (pathname.includes("/services")) return "strategy";
  if (pathname.includes("/work")) return "replay";
  if (pathname.includes("/pricing")) return "launch";
  return "home";
}

export function ThemeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const { data } = useGame();
  const simple = Boolean((data as any).simpleMode) || !data.motionOn;
  const id = simple ? "simple" : resolveThemeId(pathname, data.campaign.view);
  const theme = THEMES[id];
  const prev = useRef<ThemeId>(id);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (prev.current === id) return;
    prev.current = id;
    if (simple) return;
    setTransitioning(true);
    const t = window.setTimeout(() => setTransitioning(false), 420);
    return () => window.clearTimeout(t);
  }, [id, simple]);

  const style = useMemo(() => themeVars(theme), [theme]);
  return (
    <div data-theme={id} className={`theme-shell theme-${id}`} style={style}>
      {children}
      <div aria-hidden="true" className={`theme-wipe ${transitioning ? "theme-wipe-on" : ""} theme-wipe-${id}`} />
    </div>
  );
}
