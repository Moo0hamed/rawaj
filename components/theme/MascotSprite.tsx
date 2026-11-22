"use client";
import { cn } from "@/lib/utils";
import type { ThemeId } from "@/lib/themes";

type Mood = "happy"|"excited"|"surprised"|"shocked"|"scared"|"evil"|"sad"|"wink";

const MOOD: Record<string,Mood> = { happy:"happy", excited:"excited", surprised:"surprised", shocked:"shocked", scared:"scared", evil:"evil", sad:"sad", wink:"wink" };

export function MascotSprite({ theme, className, mood = "happy" }: { theme: ThemeId; className?: string; mood?: Mood }) {
  // Same character identity: round head, two eyes, small mouth/body, antenna/star accent. Style adapts per theme.
  const dark = theme === "home" || theme === "strategy" || theme === "ads" || theme === "team" || theme === "contact" || theme === "horror";
  const stroke = dark ? "#E9F1FF" : "#10243B";
  const face = theme === "social" ? "#FFFFFF" : theme === "ads" ? "#F3E8D2" : theme === "launch" || theme === "admin" ? "#E4E9F2" : "#0A1626";
  const accent = theme === "horror" ? "#7D5CFF" : "#2391FF";
  const yellow = "#FFF83F";
  const eye = (x:number) => mood === "wink" && x>12 ? <rect x={x} y="10" width="3" height="1.5" fill={yellow}/> : mood === "scared" ? <circle cx={x+1.5} cy="10.5" r="1.8" fill={yellow}/> : <rect x={x} y="9" width="3" height="3" fill={yellow}/>;
  const mouth = mood === "happy" || mood === "wink" ? <path d="M9 15h6" stroke={accent} strokeWidth="2" strokeLinecap="round"/> : mood === "excited" ? <rect x="10" y="14" width="4" height="3" fill={accent}/> : mood === "sad" ? <path d="M9 16c2-2 4-2 6 0" stroke={accent} strokeWidth="2" strokeLinecap="round"/> : mood === "evil" ? <path d="M9 15l2 1 2-1 2 1" stroke="#E23A3A" strokeWidth="1.8"/> : <rect x="10" y="15" width="4" height="1.5" fill={accent}/>;
  const outline = theme === "social" ? "2.2" : theme === "team" ? "1.2" : "1.8";
  const bodyShape = theme === "social" ? <rect x="4" y="4" width="16" height="14" rx="5" fill={face} stroke={stroke} strokeWidth={outline}/> : theme === "team" ? <path d="M12 4l8 5v8l-8 5-8-5V9z" fill={face} stroke={stroke} strokeWidth={outline}/> : <rect x="4" y="4" width="16" height="14" rx={theme==="launch"||theme==="admin"?4:1.5} fill={face} stroke={stroke} strokeWidth={outline}/>;
  return (
    <svg viewBox="0 0 24 24" className={cn("h-full w-full", className)} aria-hidden="true" shapeRendering={theme==="home"||theme==="strategy"||theme==="contact"||theme==="horror"?"crispEdges":"geometricPrecision"}>
      {bodyShape}
      {eye(7)}{eye(14)}
      {mouth}
      <rect x="10.5" y="19" width="3" height="2" fill={stroke} />
      <path d="M12 2v2" stroke={yellow} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
export function moodFromIndex(i: number): Mood { const m: Mood[]=["happy","excited","wink","surprised","happy","excited"]; return m[i % m.length]; }
