import { clients } from "@/content/industries";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";

export function ClientsMarquee({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const dict = getDictionary(locale);
  if (!clients.length) return null;

  return (
    <section className={compact ? "py-12" : "section pt-0 md:pt-0"}>
      <div className="shell">
        <Reveal className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">{dict.clientsSection.label}</span>
            <h2 className="mt-4 max-w-xl text-2xl font-extrabold md:text-[28px]">
              {dict.clientsSection.title}
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-ink/50">
            {dict.clientsSection.body}
          </p>
        </Reveal>
      </div>

      <div className="mask-fade-x mt-9 overflow-hidden" dir="ltr" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {[...clients, ...clients].map((client, index) => (
            <span
              key={`${client}-${index}`}
              className="inline-flex h-16 items-center gap-3 rounded-2xl border border-line bg-surface px-6 text-[15px] font-extrabold tracking-tight text-ink/70 shadow-[0_1px_0_rgba(4,11,20,0.03)]"
            >
              <span className="inline-block h-2 w-2 rotate-45 bg-brand-500" />
              {client}
            </span>
          ))}
        </div>
      </div>

      <p className="sr-only">{clients.join("، ")}</p>
    </section>
  );
}
