"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "./GameProvider";

export function CursorGlow() {
  const { data, hydrated } = useGame();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!hydrated || !data.motionOn) {
      setEnabled(false);
      return;
    }
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
  }, [hydrated, data.motionOn]);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;
    let active = false;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      const interactive = (event.target as HTMLElement | null)?.closest(
        "a, button, [role='button'], input, select, textarea, summary",
      );
      active = Boolean(interactive);
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentX - 16}px, ${currentY - 16}px, 0) scale(${active ? 1.55 : 1})`;
        ringRef.current.style.borderColor = active
          ? "rgba(255,248,63,0.85)"
          : "rgba(35,145,255,0.6)";
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX - 3}px, ${targetY - 3}px, 0)`;
      }
      frame = window.requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = window.requestAnimationFrame(render);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[85] hidden lg:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-8 w-8 rounded-full border transition-[border-color,transform] duration-150 ease-out"
        style={{ willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
