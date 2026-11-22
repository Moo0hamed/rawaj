import { team } from "@/content/team";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamGrid } from "@/components/team/TeamGrid";
import { ButtonLink } from "@/components/ui/Button";

export function TeamPreview({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="section bg-surface">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            label={dict.teamSection.label}
            title={dict.teamSection.title}
            body={dict.teamSection.body}
          />
          <ButtonLink
            href={`/${locale}/team`}
            variant="outline"
            locale={locale}
            withArrow
            className="self-start lg:self-end"
          >
            {dict.teamSection.cta}
          </ButtonLink>
        </div>

        <div className="mt-12">
          <TeamGrid members={team.slice(0, 4)} locale={locale} />
        </div>
      </div>
    </section>
  );
}
