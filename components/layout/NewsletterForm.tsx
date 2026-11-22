"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  placeholder: string;
  button: string;
  success: string;
  error: string;
};

export function NewsletterForm({ placeholder, button, success, error }: Props) {
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus("error");
      return;
    }

    // لا يوجد مزوّد بريد مربوط بهذا النموذج بعد؛ يتم تأكيد الاشتراك محليًا فقط.
    setStatus("done");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          {placeholder}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          dir="ltr"
          placeholder={placeholder}
          onChange={() => status !== "idle" && setStatus("idle")}
          className="w-full rounded-full border border-white/15 bg-surface/5 px-5 py-3 text-sm text-white placeholder:text-white/35 transition focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
        />
        <button
          type="submit"
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition",
            status === "done"
              ? "bg-emerald-400 text-ink"
              : "bg-surface text-ink hover:bg-accent hover:text-onAccent",
          )}
        >
          {status === "done" ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          {button}
        </button>
      </div>
      {status === "error" ? (
        <p role="alert" className="mt-2 text-xs font-semibold text-red-300">
          {error}
        </p>
      ) : null}
      {status === "done" ? (
        <p role="status" className="mt-2 text-xs font-semibold text-emerald-300">
          {success}
        </p>
      ) : null}
    </form>
  );
}
