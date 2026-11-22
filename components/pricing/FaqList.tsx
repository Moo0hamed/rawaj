import { Plus } from "lucide-react";
import { faqs } from "@/content/pricing";
import { pick, type Locale } from "@/lib/i18n";

export function FaqList({ locale }: { locale: Locale }) {
  return (
    <div className="divide-y divide-line rounded-4xl border border-line bg-surface">
      {faqs.map((faq) => (
        <details key={faq.question.en} className="group px-6 py-5 sm:px-8">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15.5px] font-extrabold text-ink [&::-webkit-details-marker]:hidden">
            {pick(faq.question, locale)}
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink/50 transition duration-300 group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-onAccent">
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <p className="mt-4 max-w-3xl text-[14px] leading-[1.9] text-ink/60">
            {pick(faq.answer, locale)}
          </p>
        </details>
      ))}
    </div>
  );
}
