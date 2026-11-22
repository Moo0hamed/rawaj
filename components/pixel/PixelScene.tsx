"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/components/game/GameProvider";

export type SceneKind = "identity" | "strategy" | "social" | "ads" | "replay" | "team" | "launch" | "boss" | "hero";

type Props = {
  kind: SceneKind;
  className?: string;
  lowH?: number;
};

const PAL = {
  bg0: "#03080F",
  bg1: "#050D1A",
  bg2: "#0A1626",
  blue: "#2391FF",
  blue2: "#1A6ED1",
  blue3: "#7CC6FF",
  yellow: "#FFF83F",
  yellow2: "#C7BA00",
  white: "#E9F1FF",
  gray: "#3A4A5E",
  gray2: "#6B7C90",
  black: "#040B14",
  purple: "#2A1A4A",
} as const;

function px(ctx: CanvasRenderingContext2D, x: number, y: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(x | 0, y | 0, 1, 1);
}
function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}
function ditherRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, a: string, b: string, pattern = 0) {
  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      const on = pattern === 1 ? ((xx + yy) % 4 === 0) : ((xx + yy) % 2 === 0);
      px(ctx, x + xx, y + yy, on ? a : b);
    }
  }
}
function stars(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, seed = 1) {
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 90; i++) {
    const x = Math.floor(rnd() * w);
    const y = Math.floor(rnd() * (h * 0.7));
    const tw = (Math.sin(t * 0.003 + i) + 1) / 2;
    const c = tw > 0.75 ? PAL.yellow : tw > 0.45 ? PAL.white : PAL.blue3;
    if (tw > 0.2) px(ctx, x, y, c);
  }
}
function cloud(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, c1: string, c2: string) {
  const h = Math.max(4, Math.floor(w / 4));
  for (let y = 0; y < h; y++) {
    const rowW = Math.floor(w * (1 - Math.abs(y - h / 2) / h * 0.55));
    const sx = Math.floor(cx - rowW / 2);
    for (let x = 0; x < rowW; x++) {
      const on = ((sx + x + cy + y) % 2 === 0);
      px(ctx, sx + x, cy + y - Math.floor(h / 2), on ? c1 : c2);
    }
  }
}
function bigStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, t: number) {
  const pulse = 0.7 + ((Math.sin(t * 0.004) + 1) / 2) * 0.3;
  const R = Math.max(2, Math.floor(r * pulse));
  const ray = R * 3;
  for (let i = -ray; i <= ray; i++) {
    const c = Math.abs(i) < R ? PAL.yellow : (Math.abs(i) + Math.floor(t * 0.01)) % 3 === 0 ? PAL.yellow2 : PAL.blue3;
    if (Math.abs(i) % (Math.abs(i) < R ? 1 : 2) === 0) {
      px(ctx, cx + i, cy, c);
      px(ctx, cx, cy + i, c);
    }
  }
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      if (Math.abs(dx) + Math.abs(dy) <= R + 1) {
        const edge = Math.abs(dx) + Math.abs(dy) > R - 1;
        px(ctx, cx + dx, cy + dy, edge ? PAL.yellow2 : PAL.yellow);
      }
    }
  }
  rect(ctx, cx - 1, cy - 1, 3, 3, PAL.white);
}

function drawIdentity(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  rect(ctx, 0, 0, w, h, PAL.bg0);
  ditherRect(ctx, 0, Math.floor(h * 0.55), w, Math.floor(h * 0.45), PAL.bg1, PAL.bg0);
  stars(ctx, w, h, t, 11);
  const drift = Math.floor((t * 0.008) % (w + 60)) - 30;
  cloud(ctx, drift, Math.floor(h * 0.28), 34, PAL.gray, PAL.bg2);
  cloud(ctx, (drift + 90) % (w + 60) - 30, Math.floor(h * 0.38), 26, PAL.gray2, PAL.bg2);
  cloud(ctx, (drift + 170) % (w + 60) - 30, Math.floor(h * 0.22), 22, PAL.blue2, PAL.bg2);
  bigStar(ctx, Math.floor(w * 0.72), Math.floor(h * 0.3), 5, t);
  // horizon pixels
  for (let x = 0; x < w; x++) {
    const hh = 2 + Math.floor(Math.sin(x * 0.08) * 2 + 2);
    rect(ctx, x, h - hh, 1, hh, ((x + Math.floor(h)) % 4 === 0) ? PAL.blue2 : PAL.bg2);
  }
}

function drawStrategy(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  rect(ctx, 0, 0, w, h, PAL.bg0);
  stars(ctx, w, h, t, 23);
  const grid = 16;
  const ox = Math.floor((t * 0.01) % grid);
  for (let x = -grid; x < w + grid; x += grid) {
    for (let y = 0; y < h; y++) px(ctx, x + ox, y, (y % 4 === 0) ? PAL.bg2 : PAL.bg1);
  }
  for (let y = 0; y < h; y += grid) {
    for (let x = 0; x < w; x++) px(ctx, x, y, (x % 4 === 0) ? PAL.blue2 : PAL.bg2);
  }
  // nodes/path
  const nodes = [[30, 70], [80, 45], [140, 55], [200, 30], [250, 60]].map(([x, y]) => [Math.floor(x * w / 320), Math.floor(y * h / 144)]);
  for (let i = 0; i < nodes.length - 1; i++) {
    const [ax, ay] = nodes[i], [bx, by] = nodes[i + 1];
    const steps = Math.max(Math.abs(bx - ax), Math.abs(by - ay));
    for (let s = 0; s <= steps; s++) {
      const x = Math.round(ax + (bx - ax) * s / steps);
      const y = Math.round(ay + (by - ay) * s / steps);
      px(ctx, x, y, (s + Math.floor(t * 0.02)) % 6 < 3 ? PAL.blue : PAL.blue2);
    }
  }
  nodes.forEach(([x, y], i) => {
    const active = Math.floor(t * 0.002) % nodes.length === i;
    rect(ctx, x - 2, y - 2, 5, 5, active ? PAL.yellow : PAL.blue);
    rect(ctx, x - 1, y - 1, 3, 3, active ? PAL.white : PAL.blue3);
  });
  // compass/star
  bigStar(ctx, Math.floor(w * 0.82), Math.floor(h * 0.22), 4, t);
}

function drawSocial(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // playful cartoon: aqua sky, big waves, flat clouds, original mascot bubble
  rect(ctx, 0, 0, w, h, "#DFF6FF");
  rect(ctx, 0, Math.floor(h*0.55), w, Math.floor(h*0.45), "#BEEBFF");
  // waves
  for (let x=0;x<w;x++) {
    const y1 = Math.floor(h*0.58 + Math.sin(x*0.08 + t*0.002)*4);
    const y2 = Math.floor(h*0.72 + Math.sin(x*0.06 - t*0.0015)*5);
    for (let y=y1;y<h;y++) px(ctx,x,y, y<y2 ? "#7DD3FC" : "#2391FF");
  }
  // clouds
  const cloudBlob = (cx:number,cy:number,r:number)=>{
    for(let y=-r;y<=r;y++) for(let x=-r*2;x<=r*2;x++) if ((x*x)/(r*r*4) + (y*y)/(r*r) <= 1) px(ctx,cx+x,cy+y, "#FFFFFF");
    for(let y=-r;y<=r;y++) for(let x=-r*2;x<=r*2;x++) if ((x*x)/(r*r*4) + (y*y)/(r*r) > 1 && (x*x)/((r+1)*(r+1)*4) + (y*y)/((r+1)*(r+1)) <= 1) px(ctx,cx+x,cy+y, "#10243B");
  };
  const drift = Math.floor((t*0.01)%(w+80))-40;
  cloudBlob(drift, Math.floor(h*0.22), 8); cloudBlob(drift+28, Math.floor(h*0.2), 10);
  cloudBlob((drift+140)%(w+80)-40, Math.floor(h*0.28), 7);
  // original mascot card
  rect(ctx, Math.floor(w*0.68), Math.floor(h*0.18), 58, 40, "#FFFFFF");
  for(let i=0;i<58;i++){px(ctx,Math.floor(w*0.68)+i,Math.floor(h*0.18),"#10243B");px(ctx,Math.floor(w*0.68)+i,Math.floor(h*0.18)+39,"#10243B");}
  for(let i=0;i<40;i++){px(ctx,Math.floor(w*0.68),Math.floor(h*0.18)+i,"#10243B");px(ctx,Math.floor(w*0.68)+57,Math.floor(h*0.18)+i,"#10243B");}
  const mx=Math.floor(w*0.78), my=Math.floor(h*0.32);
  rect(ctx,mx-8,my-8,16,12,"#FFF83F"); rect(ctx,mx-6,my-5,3,3,"#10243B"); rect(ctx,mx+3,my-5,3,3,"#10243B"); rect(ctx,mx-3,my+1,6,2,"#2391FF");
}

function drawGeneric(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, kind: SceneKind) {
  const darkBoss = kind === "boss";
  rect(ctx, 0, 0, w, h, darkBoss ? "#05000A" : PAL.bg0);
  stars(ctx, w, h, t, kind === "launch" ? 41 : 53);
  if (kind === "ads") {
    rect(ctx,0,0,w,h,"#12090B");
    for(let y=0;y<h;y++){ const v=18+Math.floor((y/h)*18); rect(ctx,0,y,w,1,`rgb(${v},${Math.floor(v*0.45)},${Math.floor(v*0.5)})`); }
    for(let y=0;y<h;y+=4){ for(let x=(y%8===0?0:2);x<w;x+=4){ if(Math.random()<0.08) px(ctx,x,y,"#E23A3A"); } }
    rect(ctx,14,18,w-28,h-36,"#F3E8D2");
    for(let y=20;y<h-20;y+=3){ for(let x=16;x<w-16;x+=3){ if((x+y)%9===0) px(ctx,x,y,"#C9B8A0"); } }
    rect(ctx,24,28,Math.floor(w*0.42),16,"#12090B");
    rect(ctx,28,32,Math.floor(w*0.3),8,"#E23A3A");
    rect(ctx,24,52,Math.floor(w*0.55),8,"#12090B");
    rect(ctx,24,64,Math.floor(w*0.48),4,"#7A0F14");
    rect(ctx,24,72,Math.floor(w*0.44),4,"#7A0F14");
    const mx=w-78, my=30;
    rect(ctx,mx+10,my,26,26,"#12090B"); rect(ctx,mx+12,my+2,22,22,"#E23A3A");
    rect(ctx,mx+18,my+8,10,10,"#F3E8D2"); rect(ctx,mx+22,my+12,2,2,"#12090B");
    rect(ctx,mx,my+8,10,10,"#12090B"); rect(ctx,mx+36,my+8,10,10,"#12090B");
    rect(ctx,mx+2,my+32,42,8,"#12090B");
    for(let i=0;i<4;i++){ const bx=24+i*58, by=h-58; rect(ctx,bx,by,48,30,"#12090B"); rect(ctx,bx+2,by+2,44,26,"#F3E8D2"); rect(ctx,bx+5,by+6,20,3,"#12090B"); rect(ctx,bx+5,by+12,34,2,"#7A0F14"); rect(ctx,bx+5,by+17,26,2,"#7A0F14"); rect(ctx,bx+34,by+20,8,6,"#E23A3A"); }
    rect(ctx,0,h-10,w,10,"#12090B");
    for(let x=0;x<w;x+=6){ px(ctx,x,h-8,"#E23A3A"); }
  } else if (kind === "replay") {
    // ocean flat: sky top, waterline, underwater bottom
    const waterY = Math.floor(h*0.38);
    for(let y=0;y<waterY;y++){ rect(ctx,0,y,w,1, y<waterY*0.5?"#9EE7F0":"#7EDCE8"); }
    for(let y=waterY;y<h;y++){ const d=(y-waterY)/(h-waterY); rect(ctx,0,y,w,1, d<0.5?"#0E8794":"#0A6F7A"); }
    rect(ctx,0,waterY-1,w,2,"#EAFBFF");
    // sun
    const sx=Math.floor(w*0.82), sy=Math.floor(h*0.16);
    for(let dy=-8;dy<=8;dy++) for(let dx=-8;dx<=8;dx++) if(dx*dx+dy*dy<=64) px(ctx,sx+dx,sy+dy,"#FFF83F");
    // clouds
    rect(ctx,Math.floor(w*0.12),Math.floor(h*0.12),26,8,"#EAFBFF"); rect(ctx,Math.floor(w*0.15),Math.floor(h*0.08),18,8,"#EAFBFF");
    // porthole/video frame
    const px0=Math.floor(w*0.32), py0=Math.floor(h*0.22), pw=Math.floor(w*0.36), ph=Math.floor(h*0.42);
    rect(ctx,px0-4,py0-4,pw+8,ph+8,"#074B52"); rect(ctx,px0,py0,pw,ph,"#063A40");
    rect(ctx,px0+Math.floor(pw/2)-5,py0+Math.floor(ph/2)-5,10,10,"#FFF83F");
    // fish/bubbles below
    for(let i=0;i<5;i++){ const fx=(Math.floor(t*0.02)+i*60)%(w+20)-10; const fy=waterY+20+(i%3)*14; rect(ctx,fx,fy,8,4,"#EAFBFF"); rect(ctx,fx+7,fy+1,2,2,"#EAFBFF"); px(ctx,fx+2,fy+1,"#074B52"); }
    for(let i=0;i<6;i++){ const bx=(i*37)%w; const by=h-10-((Math.floor(t*0.03)+i*20)%(h-waterY)); if(by>waterY){ rect(ctx,bx,by,2,2,"#C8EEF5"); } }
  } else if (kind === "team") {
    // sumi-e ink wash: paper dark, brush strokes, ornate frame hint
    rect(ctx,0,0,w,h,"#0B0B0B");
    for(let y=0;y<h;y++){ const v=11+Math.floor((y/h)*18); rect(ctx,0,y,w,1,`rgb(${v},${v},${v})`); }
    for(let i=0;i<18;i++){ const x=Math.floor((i*47)%w); const y=Math.floor((i*29)%h); const len=30+(i*13)%50; for(let j=0;j<len;j++){ const yy=y+Math.floor(Math.sin(j*0.1+i)*3); if(yy>=0&&yy<h) px(ctx,(x+j)%w,yy, i%3===0?"#2A2A2A":"#1E1E1E"); } }
    // ornate corners
    rect(ctx,10,10,24,2,"#CBBBA0"); rect(ctx,10,10,2,24,"#CBBBA0"); rect(ctx,w-34,10,24,2,"#CBBBA0"); rect(ctx,w-12,10,2,24,"#CBBBA0");
    rect(ctx,10,h-12,24,2,"#CBBBA0"); rect(ctx,10,h-34,2,24,"#CBBBA0"); rect(ctx,w-34,h-12,24,2,"#CBBBA0"); rect(ctx,w-12,h-34,2,24,"#CBBBA0");
    // three cards silhouette
    for(let i=0;i<3;i++){ const cx=Math.floor(w*(0.2+i*0.3)); rect(ctx,cx-18,h-58,36,46,"#141414"); rect(ctx,cx-18,h-58,36,1,"#CBBBA0"); rect(ctx,cx-8,h-48,16,16,"#232323"); rect(ctx,cx-10,h-28,20,2,"#3A3A3A"); rect(ctx,cx-8,h-24,16,2,"#2A2A2A"); }
  } else if (kind === "launch") {
    // neumorphic light gray + blue accents
    rect(ctx,0,0,w,h,"#E4E9F2");
    for(let y=0;y<h;y+=8){ for(let x=0;x<w;x+=8){ if((x+y)%16===0) px(ctx,x,y,"#D7DFEA"); } }
    // raised cards
    const card=(x:number,y:number,cw:number,ch:number)=>{ rect(ctx,x,y,cw,ch,"#E4E9F2"); rect(ctx,x,y,cw,1,"#FFFFFF"); rect(ctx,x,y,1,ch,"#FFFFFF"); rect(ctx,x,y+ch-1,cw,1,"#C2CCD8"); rect(ctx,x+cw-1,y,1,ch,"#C2CCD8"); };
    card(Math.floor(w*0.1),Math.floor(h*0.18),Math.floor(w*0.35),Math.floor(h*0.45));
    card(Math.floor(w*0.52),Math.floor(h*0.22),Math.floor(w*0.34),Math.floor(h*0.22));
    card(Math.floor(w*0.52),Math.floor(h*0.52),Math.floor(w*0.34),Math.floor(h*0.18));
    rect(ctx,Math.floor(w*0.14),Math.floor(h*0.28),Math.floor(w*0.18),6,"#2391FF");
    rect(ctx,Math.floor(w*0.14),Math.floor(h*0.4),Math.floor(w*0.24),4,"#BFC9D7");
    rect(ctx,Math.floor(w*0.14),Math.floor(h*0.48),Math.floor(w*0.2),4,"#BFC9D7");
    // rocket accent
    const rx=Math.floor(w*0.78), ry=Math.floor(h*0.36 - (Math.sin(t*0.002)+1)*4);
    rect(ctx,rx-3,ry-10,6,12,"#2391FF"); rect(ctx,rx-2,ry-14,4,4,"#7CC6FF"); rect(ctx,rx-1,ry+2,2,4,"#FFF83F");
  } else if (kind === "boss") {
    rect(ctx,0,0,w,h,"#07162D");
    for(let y=0;y<h;y++){ const d=Math.floor((y/h)*20); rect(ctx,0,y,w,1, d<8?"#0B2245":d<14?"#081A36":"#07162D"); }
    // light beam
    const cxm=Math.floor(w/2);
    for(let y=0;y<h;y++){ const spread=Math.floor(y*0.18); for(let x=cxm-spread;x<=cxm+spread;x++){ if(x>=0&&x<w && (x+y)%3===0) px(ctx,x,y, y<h*0.35?"#7CC6FF":"#2391FF"); } }
    // falling figure silhouette
    const fy=Math.floor(h*0.35 + Math.sin(t*0.001)*6);
    rect(ctx,cxm-2,fy,4,6,"#EAF4FF"); rect(ctx,cxm-4,fy+2,8,2,"#EAF4FF"); rect(ctx,cxm-2,fy+6,1,4,"#EAF4FF"); rect(ctx,cxm+1,fy+6,1,4,"#EAF4FF");
    // floor glow
    for(let x=0;x<w;x++){ const gy=h-8+Math.floor(Math.sin(x*0.2)*2); rect(ctx,x,gy,1,h-gy,"#0A1C38"); if(x%6===0) px(ctx,x,gy,"#2391FF"); }
  } else {
    bigStar(ctx, Math.floor(w * 0.7), Math.floor(h * 0.28), 5, t);
  }
  bigStar(ctx, Math.floor(w * 0.82), Math.floor(h * 0.18), 3, t);
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, kind: SceneKind) {
  if (kind === "identity" || kind === "hero") drawIdentity(ctx, w, h, t);
  else if (kind === "strategy") drawStrategy(ctx, w, h, t);
  else if (kind === "social") drawSocial(ctx, w, h, t);
  else drawGeneric(ctx, w, h, t, kind);
}

export function PixelScene({ kind, className = "", lowH = 144 }: Props) {
  const { data } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const simple = (data as any).simpleMode;
  const reduce = !data.motionOn;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    let raf = 0;
    let last = 0;
    let stopped = false;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const ratio = rect.width / Math.max(1, rect.height);
      const h = lowH;
      const w = Math.max(160, Math.floor(h * ratio));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const render = (t: number) => {
      if (stopped) return;
      resize();
      if (reduce || simple) {
        draw(ctx, canvas.width, canvas.height, 0, kind);
        return;
      }
      if (document.hidden) { raf = requestAnimationFrame(render); return; }
      if (t - last < 33) { raf = requestAnimationFrame(render); return; }
      last = t;
      draw(ctx, canvas.width, canvas.height, t, kind);
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    const ro = new ResizeObserver(() => { if (reduce || simple) render(0); });
    ro.observe(wrap);
    const vis = () => { if (!document.hidden && !reduce && !simple) { last = 0; } };
    document.addEventListener("visibilitychange", vis);
    return () => { stopped = true; cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, [kind, lowH, reduce, simple]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ imageRendering: "pixelated", display: "block" }}
      />
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 2px rgba(35,145,255,0.15)" }} />
    </div>
  );
}
