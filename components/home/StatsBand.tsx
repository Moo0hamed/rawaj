import { stats } from "@/content/site";
import { pick, type Locale } from "@/lib/i18n";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { getDictionary } from "@/content/dictionaries";

export function StatsBand({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="border-b border-line bg-surface">
      <div className="shell py-12 md:py-16">
        <Reveal className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{dict.stats.label}</p>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-ink/50">
              {dict.stats.note}
            </p>
          </div>
          <span className="hidden h-px w-40 bg-line sm:block" />
        </Reveal>

        <RevealStagger className="mt-9 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {stats.map((stat) => (
            <RevealItem key={stat.label.en}>
              <div className="group">
                <p className="text-[clamp(2.4rem,5vw,3.4rem)] font-black leading-none tracking-tight text-ink">
                  <CountUp to={stat.value} suffix={stat.suffix} locale={locale} />
                </p>
                <span className="mt-4 block h-[3px] w-9 rounded-full bg-accent-600 transition-all duration-500 group-hover:w-16" />
                <p className="mt-3 text-[13.5px] font-semibold text-ink/55">
                  {pick(stat.label, locale)}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
