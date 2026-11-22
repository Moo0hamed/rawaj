import { processSteps } from "@/content/industries";
import { getDictionary } from "@/content/dictionaries";
import { pick, type Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealItem, RevealStagger } from "@/components/ui/Reveal";

export function ProcessTimeline({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="section relative overflow-hidden bg-surface">
      <div className="shell relative">
        <SectionHeading
          label={dict.processSection.label}
          title={dict.processSection.title}
          body={dict.processSection.body}
        />

        <RevealStagger className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <span
            aria-hidden="true"
            className="absolute inset-x-10 top-[26px] hidden border-t border-dashed border-ink/15 lg:block"
          />
          {processSteps.map((step, index) => (
            <RevealItem key={step.title.en} className="relative">
              <div className="group h-full rounded-3xl border border-transparent p-1 transition hover:border-line">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-line bg-paper text-[13px] font-black text-ink/40 transition duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-onAccent">
                  0{index + 1}
                </div>
                <h3 className="mt-6 text-[18px] font-extrabold">{pick(step.title, locale)}</h3>
                <p className="mt-2.5 text-[14px] leading-[1.8] text-ink/55">
                  {pick(step.body, locale)}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
