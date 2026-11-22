import Link from "next/link";
import { services } from "@/content/services";
import { getDictionary } from "@/content/dictionaries";
import { pick, type Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { ServiceIcon } from "@/components/ui/Icons";
import { Arrow } from "@/components/ui/Arrows";
import { ButtonLink } from "@/components/ui/Button";

export function ServicesGrid({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="section bg-paper">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            label={dict.servicesSection.label}
            title={dict.servicesSection.title}
            body={dict.servicesSection.body}
          />
          <ButtonLink
            href={`/${locale}/services`}
            variant="outline"
            locale={locale}
            withArrow
            className="self-start lg:self-end"
          >
            {dict.servicesSection.cta}
          </ButtonLink>
        </div>

        <RevealStagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <RevealItem key={service.slug} className="h-full">
              <Link
                href={`/${locale}/services/${service.slug}`}
                className="group relative flex h-full min-h-[268px] flex-col justify-between overflow-hidden rounded-4xl border border-line bg-surface p-7 transition duration-500 ease-smooth hover:-translate-y-1 hover:border-ink hover:bg-abyss hover:shadow-lift"
              >
                <div className="flex items-start justify-between">
                  <span className="icon-tile transition duration-500 group-hover:bg-accent group-hover:text-onAccent">
                    <ServiceIcon name={service.icon} className="h-6 w-6" />
                  </span>
                  <span className="text-[12px] font-black tracking-[0.16em] text-ink/25 transition group-hover:text-white/30">
                    0{index + 1}
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="text-[21px] font-extrabold leading-snug text-ink transition group-hover:text-white">
                    {pick(service.title, locale)}
                  </h3>
                  <p className="mt-2.5 max-w-[92%] text-[14px] leading-relaxed text-ink/55 transition group-hover:text-white/60">
                    {pick(service.short, locale)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-brand-300 transition group-hover:text-accent">
                    {dict.servicesSection.servicePageCta}
                    <Arrow
                      locale={locale}
                      className="transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    />
                  </span>
                </div>

                <span className="pointer-events-none absolute -bottom-16 -end-16 h-40 w-40 rounded-full bg-brand-500/0 blur-3xl transition duration-700 group-hover:bg-brand-500/40" />
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
