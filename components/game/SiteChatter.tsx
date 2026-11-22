"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { chatter } from "@/content/playground";
import { pick, type Locale } from "@/lib/i18n";

const KEY = "rawaj-chatter-off";

export function SiteChatter({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    let off = false;
    try {
      off = window.sessionStorage.getItem(KEY) === "1";
    } catch {
      /* ignore */
    }
    if (off) return;
    setDismissed(false);
    setIndex(Math.floor(Math.random() * chatter.length));
    const show = window.setTimeout(() => setVisible(true), 16000);
    return () => window.clearTimeout(show);
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const loop = window.setInterval(() => {
      setIndex((value) => (value + 1) % chatter.length);
    }, 26000);
    return () => window.clearInterval(loop);
  }, [dismissed]);

  const close = () => {
    setVisible(false);
    setDismissed(true);
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="safe-bottom fixed bottom-4 start-4 z-[79] hidden max-w-[280px] sm:block"
        >
          <div className="flex items-start gap-2 rounded-2xl border border-line bg-abyss/90 p-3 pe-2 shadow-[0_0_30px_-14px_rgba(35,145,255,0.8)] backdrop-blur">
            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-200">
              <MessageCircle className="h-3.5 w-3.5" />
            </span>
            <button
              type="button"
              onClick={() => setIndex((value) => (value + 1) % chatter.length)}
              className="text-start text-[11.5px] leading-relaxed text-ink/60"
            >
              {pick(chatter[index], locale)}
            </button>
            <button
              type="button"
              onClick={close}
              aria-label={locale === "ar" ? "إغلاق الرسائل" : "Close messages"}
              className="shrink-0 rounded-full p-1 text-ink/25 transition hover:text-ink/70"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
