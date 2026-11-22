import { projects } from "@/content/projects";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function WorkShowcase({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [featured, ...rest] = projects;

  return (
    <section className="section bg-surface">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            label={dict.workSection.label}
            title={dict.workSection.title}
            body={dict.workSection.body}
          />
          <ButtonLink
            href={`/${locale}/work`}
            variant="outline"
            locale={locale}
            withArrow
            className="self-start lg:self-end"
          >
            {dict.workSection.cta}
          </ButtonLink>
        </div>

        <Reveal className="mt-12">
          <ProjectCard project={featured} locale={locale} dict={dict} featured />
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.slice(0, 2).map((project, index) => (
            <Reveal key={project.slug} delay={0.08 + index * 0.08}>
              <ProjectCard project={project} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
