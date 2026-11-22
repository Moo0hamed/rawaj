export type ThemeId =
  | "intro" | "home" | "strategy" | "social" | "ads"
  | "replay" | "team" | "launch" | "contact" | "horror" | "admin" | "simple";

export type ThemeDef = {
  id: ThemeId;
  label: string;
  vars: Record<string, string>;
  className?: string;
};

const brand = {
  "--brand":"#2391FF","--brand-dark":"#1A6ED1","--brand-light":"#7CC6FF",
  "--accent":"#FFF83F","--accent-dark":"#C7BA00","--on-accent":"#040B14",
} as const;

export const THEMES: Record<ThemeId, ThemeDef> = {
  intro: { id:"intro", label:"Intro Poster", vars:{
    ...brand,"--bg":"#4A1218","--bg2":"#5C1A22","--surface":"#3D0E14","--ink":"#F3E8D2","--muted":"#D6C4A8","--line":"#F3E8D2","--card":"#4A1218","--shadow":"6px 6px 0 #2A080C",
    "--font-display":"var(--font-lalezar),'Lalezar','Changa',sans-serif","--font-body":"var(--font-ar),'Changa',sans-serif","--radius":"0px","--btn-bg":"#F3E8D2","--btn-fg":"#4A1218","--btn-border":"#F3E8D2"
  }},
  home: { id:"home", label:"Pixel Night Sky", vars:{
    ...brand,"--bg":"#050D1A","--bg2":"#0A1626","--surface":"#0A1626","--ink":"#E9F1FF","--muted":"#8FA8C4","--line":"#1A2D45","--card":"#0A1626","--shadow":"4px 4px 0 #040B14",
    "--font-display":"var(--font-px-ar),'Handjet','Changa',sans-serif","--font-body":"var(--font-ar),'Changa',sans-serif","--radius":"0px","--btn-bg":"#FFF83F","--btn-fg":"#040B14","--btn-border":"#040B14"
  }},
  strategy: { id:"strategy", label:"Mosaic Grid", vars:{
    ...brand,"--bg":"#0B1320","--bg2":"#111C2E","--surface":"#141F33","--ink":"#EAF2FF","--muted":"#9FB4CC","--line":"#2391FF","--card":"#141F33","--shadow":"4px 4px 0 #040B14",
    "--font-display":"var(--font-px-ar),'Handjet','Changa',sans-serif","--font-body":"var(--font-ar),'Changa',sans-serif","--radius":"0px","--btn-bg":"#2391FF","--btn-fg":"#040B14","--btn-border":"#040B14"
  }},
  social: { id:"social", label:"Playful Cartoon", vars:{
    ...brand,"--bg":"#DFF6FF","--bg2":"#BEEBFF","--surface":"#FFFFFF","--ink":"#10243B","--muted":"#33506B","--line":"#10243B","--card":"#FFFFFF","--shadow":"5px 5px 0 #10243B",
    "--font-display":"var(--font-baloo),'Baloo Bhaijaan 2','Changa',sans-serif","--font-body":"var(--font-ar),'Changa',sans-serif","--radius":"18px","--btn-bg":"#2391FF","--btn-fg":"#FFFFFF","--btn-border":"#10243B"
  }},
  ads: { id:"ads", label:"Poster Impact", vars:{
    ...brand,"--bg":"#12090B","--bg2":"#1E0E12","--surface":"#F3E8D2","--ink":"#F3E8D2","--muted":"#D7C7B0","--line":"#E23A3A","--card":"#F3E8D2","--shadow":"6px 6px 0 #000000",
    "--font-display":"var(--font-alex),'Alexandria','Changa',sans-serif","--font-body":"var(--font-ar),'Changa',sans-serif","--radius":"20px","--btn-bg":"#E23A3A","--btn-fg":"#F3E8D2","--btn-border":"#000000"
  }},
  replay: { id:"replay", label:"Ocean Flat", vars:{
    ...brand,"--bg":"#0A6F7A","--bg2":"#0E8794","--surface":"#EAFBFF","--ink":"#EAFBFF","--muted":"#C8EEF5","--line":"#074B52","--card":"#0C5E68","--shadow":"0 8px 0 #074B52",
    "--font-display":"var(--font-baloo),'Baloo Bhaijaan 2','Changa',sans-serif","--font-body":"var(--font-ar),'Changa',sans-serif","--radius":"24px","--btn-bg":"#FFF83F","--btn-fg":"#074B52","--btn-border":"#074B52"
  }},
  team: { id:"team", label:"Ink Wash", vars:{
    ...brand,"--bg":"#0B0B0B","--bg2":"#141414","--surface":"rgba(245,239,226,0.06)","--ink":"#F5EFE2","--muted":"#D0C4AE","--line":"#CBBBA0","--card":"rgba(245,239,226,0.08)","--shadow":"0 0 0 1px #CBBBA0",
    "--font-display":"var(--font-reem),'Reem Kufi','Changa',sans-serif","--font-body":"var(--font-ar),'Changa',sans-serif","--radius":"2px","--btn-bg":"#F5EFE2","--btn-fg":"#111111","--btn-border":"#CBBBA0"
  }},
  launch: { id:"launch", label:"Neumorphic", vars:{
    ...brand,"--bg":"#E4E9F2","--bg2":"#DDE3EC","--surface":"#E4E9F2","--ink":"#24364D","--muted":"#5B708B","--line":"#C9D5E3","--card":"#E4E9F2","--shadow":"8px 8px 16px #C2CCD8,-8px -8px 16px #FFFFFF",
    "--font-display":"var(--font-ibm),'IBM Plex Sans Arabic','Changa',sans-serif","--font-body":"var(--font-ibm),'IBM Plex Sans Arabic','Changa',sans-serif","--radius":"20px","--btn-bg":"#E4E9F2","--btn-fg":"#2391FF","--btn-border":"#C9D5E3"
  }},
  contact: { id:"contact", label:"Game Over Glow", vars:{
    ...brand,"--bg":"#07162D","--bg2":"#0B2245","--surface":"#0A1C38","--ink":"#EAF4FF","--muted":"#9FC0E6","--line":"#2391FF","--card":"#0A1C38","--shadow":"0 0 0 2px #2391FF, 0 0 24px rgba(35,145,255,.35)",
    "--font-display":"var(--font-px-ar),'Handjet','Changa',sans-serif","--font-body":"var(--font-ar),'Changa',sans-serif","--radius":"0px","--btn-bg":"#2391FF","--btn-fg":"#041022","--btn-border":"#7CC6FF"
  }},
  horror: { id:"horror", label:"Glitch Horror", vars:{
    ...brand,"--bg":"#120826","--bg2":"#1B0E36","--surface":"#1A1030","--ink":"#EBDDFF","--muted":"#B8A3D9","--line":"#7D5CFF","--card":"#1A1030","--shadow":"0 0 0 2px #7D5CFF, 0 0 24px rgba(125,92,255,.25)",
    "--font-display":"var(--font-px-ar),'Handjet','Changa',sans-serif","--font-body":"var(--font-ar),'Changa',sans-serif","--radius":"0px","--btn-bg":"#7D5CFF","--btn-fg":"#120826","--btn-border":"#EBDDFF"
  }},
  admin: { id:"admin", label:"Admin Neumorphic", vars:{
    ...brand,"--bg":"#E4E9F2","--bg2":"#DDE3EC","--surface":"#E4E9F2","--ink":"#24364D","--muted":"#5B708B","--line":"#C9D5E3","--card":"#E4E9F2","--shadow":"6px 6px 12px #C2CCD8,-6px -6px 12px #FFFFFF",
    "--font-display":"var(--font-ibm),'IBM Plex Sans Arabic','Changa',sans-serif","--font-body":"var(--font-ibm),'IBM Plex Sans Arabic','Changa',sans-serif","--radius":"16px","--btn-bg":"#2391FF","--btn-fg":"#FFFFFF","--btn-border":"#1A6ED1"
  }},
  simple: { id:"simple", label:"Simple", vars:{
    ...brand,"--bg":"#050D1A","--bg2":"#0A1626","--surface":"#0A1626","--ink":"#E9F1FF","--muted":"#A9BCD1","--line":"#2A3F58","--card":"#0A1626","--shadow":"none",
    "--font-display":"var(--font-ar),'Changa',sans-serif","--font-body":"var(--font-ar),'Changa',sans-serif","--radius":"8px","--btn-bg":"#2391FF","--btn-fg":"#040B14","--btn-border":"#2391FF"
  }},
};

export const STAGE_THEMES: ThemeId[] = ["home","strategy","social","ads","replay","team","launch","contact"];
export function themeForStage(view: number): ThemeId { return STAGE_THEMES[Math.max(0, Math.min(7, view))] ?? "home"; }
export function themeVars(theme: ThemeDef): React.CSSProperties {
  return theme.vars as React.CSSProperties;
}
