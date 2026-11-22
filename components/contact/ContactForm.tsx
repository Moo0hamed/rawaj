"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send, AlertCircle, ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["contactPage"];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      service: String(data.get("service") ?? "").trim(),
      budget: String(data.get("budget") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      locale,
    };

    const nextErrors: Errors = {};
    if (payload.name.length < 2) nextErrors.name = dict.validity.nameRequired;
    if (!payload.email) nextErrors.email = dict.validity.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email))
      nextErrors.email = dict.validity.emailInvalid;
    if (payload.message.length < 10) nextErrors.message = dict.validity.messageRequired;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-[#60B8FF]/30 bg-[#0B2245] p-9 text-center text-white">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF83F] text-[#07162D]">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-[21px] font-extrabold">{dict.successTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-white/60">
          {dict.successBody}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-[#60B8FF] px-5 py-2.5 text-[13.5px] font-bold text-[#60B8FF] hover:bg-[#60B8FF] hover:text-[#07162D]"
        >
          {dict.submit}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-white/55" htmlFor="name">
            {dict.name} <span className="text-brand-300">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={locale === "ar" ? "محمد أحمد" : "John Doe"}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn("field !border-[#60B8FF]/25 !bg-[#07162D] !text-white placeholder:!text-white/25 focus:!border-[#60B8FF]", errors.name && "!border-red-400")}
          />
          {errors.name ? (
            <p id="name-error" role="alert" className="mt-1.5 text-[12px] font-semibold text-red-300">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-white/55" htmlFor="email">
            {dict.email} <span className="text-brand-300">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            placeholder="name@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn("field !border-[#60B8FF]/25 !bg-[#07162D] !text-white placeholder:!text-white/25 focus:!border-[#60B8FF]", errors.email && "!border-red-400")}
          />
          {errors.email ? (
            <p id="email-error" role="alert" className="mt-1.5 text-[12px] font-semibold text-red-300">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-white/55" htmlFor="phone">
            {dict.phone}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="+20 100 000 0000"
            className="field !border-[#60B8FF]/25 !bg-[#07162D] !text-white placeholder:!text-white/25 focus:!border-[#60B8FF]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-white/55" htmlFor="company">
            {dict.company}
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="field !border-[#60B8FF]/25 !bg-[#07162D] !text-white placeholder:!text-white/25 focus:!border-[#60B8FF]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-white/55" htmlFor="service">
            {dict.service}
          </label>
          <div className="relative">
            <select
              id="service"
              name="service"
              className="field appearance-none pe-10 !border-[#60B8FF]/25 !bg-[#07162D] !text-white focus:!border-[#60B8FF]"
              defaultValue=""
            >
              <option value="" disabled>
                {locale === "ar" ? "اختر الخدمة" : "Select a service"}
              </option>
              {dict.serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-white/55" htmlFor="budget">
            {dict.budget}
          </label>
          <div className="relative">
            <select
              id="budget"
              name="budget"
              className="field appearance-none pe-10 !border-[#60B8FF]/25 !bg-[#07162D] !text-white focus:!border-[#60B8FF]"
              defaultValue=""
            >
              <option value="" disabled>
                {locale === "ar" ? "اختر النطاق" : "Select a range"}
              </option>
              {dict.budgetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-white/55" htmlFor="message">
          {dict.message} <span className="text-brand-300">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={dict.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn("field resize-y !border-[#60B8FF]/25 !bg-[#07162D] !text-white placeholder:!text-white/25 focus:!border-[#60B8FF]", errors.message && "!border-red-400")}
        />
        {errors.message ? (
          <p id="message-error" role="alert" className="mt-1.5 text-[12px] font-semibold text-red-300">
            {errors.message}
          </p>
        ) : null}
      </div>

      {status === "error" ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-[13px] font-semibold text-red-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {dict.error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full border-2 border-[#FFF83F] bg-[#FFF83F]/10 px-7 py-3 text-[13px] font-black text-[#FFF83F] transition hover:bg-[#FFF83F] hover:text-[#07162D] disabled:cursor-not-allowed disabled:opacity-60 inline-flex items-center gap-2"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {dict.sending}
            </>
          ) : (
            <>
              {dict.submit}
              <Send className="h-4 w-4 transition-transform duration-300 ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </>
          )}
        </button>
        <p className="text-[12px] text-white/40">{dict.formBody}</p>
      </div>
    </form>
  );
}
