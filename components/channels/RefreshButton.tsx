"use client";

import { useState } from "react";
import { Loader2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export function RefreshButton({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleRefresh = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/channels/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل التحديث");
      setStatus("success");
      setMessage(locale === "ar" ? "تم تحديث القنوات بنجاح" : "Channels refreshed successfully");
      setTimeout(() => { setStatus("idle"); setMessage(""); }, 3000);
    } catch (e: any) {
      setStatus("error");
      setMessage(e.message || (locale === "ar" ? "فشل التحديث" : "Refresh failed"));
      setTimeout(() => { setStatus("idle"); setMessage(""); }, 4000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleRefresh}
        disabled={status === "loading"}
        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-400/50 bg-brand-500/10 px-3 py-2 text-[12px] font-bold text-brand-200 transition hover:border-brand-400 hover:bg-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === "success" ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : status === "error" ? (
          <AlertCircle className="h-4 w-4 text-red-400" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        <span>{status === "loading" ? (locale === "ar" ? "جاري التحديث..." : "Refreshing...") : (locale === "ar" ? "حدّث الآن" : "Refresh now")}</span>
      </button>
      {message && (
        <span className={status === "error" ? "text-red-300" : "text-emerald-300"} role="status" aria-live="polite">
          {message}
        </span>
      )}
    </div>
  );
}