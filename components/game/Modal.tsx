"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  wide?: boolean;
  hideClose?: boolean;
  className?: string;
};

export function Modal({ open, onClose, title, eyebrow, children, wide, hideClose, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 30);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center overflow-y-auto bg-[#03080F]/95 p-3 sm:items-center sm:p-6"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative my-auto w-full overflow-hidden border-4 border-[#2391FF] bg-[#0A1626]",
          wide ? "max-w-3xl" : "max-w-xl",
          className,
        )}
        style={{ boxShadow: "6px 6px 0 0 #040B14, inset 2px 2px 0 0 #14243a" }}
      >
        <div className="flex items-start justify-between gap-4 border-b-4 border-[#1A2D45] px-5 py-4 sm:px-6">
          <div>
            {eyebrow ? <p className="pixel-label mb-1">{eyebrow}</p> : null}
            <h2 className="text-[17px] font-extrabold leading-snug text-ink">{title}</h2>
          </div>
          {hideClose ? null : (
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق / Close"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center border-2 border-[#1A2D45] bg-[#050D1A] text-ink/70 hover:border-[#FFF83F] hover:text-[#FFF83F]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}