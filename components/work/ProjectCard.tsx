import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { pick, type Locale } from "@/lib/i18n";
import type { Project } from "@/content/projects";
import type { Dictionary } from "@/content/dictionaries";
import { ArrowUpRight, Lock } from "lucide-react";

type Props = {
  project: Project;
  locale: Locale;
  dict: Dictionary;
  featured?: boolean;
  className?: string;
};

export function ProjectCard({ project, locale, dict, featured, className }: Props) {
  const categoryLabel = dict.workPage.categories[project.category];

  if (project.locked) {
    return (
      <article
        className={cn(
          "relative overflow-hidden rounded-4xl border border-dashed border-line bg-white/[0.015] p-5",
          "min-h-[240px]",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-[10.5px] font-bold text-ink/45">
            {categoryLabel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2.5 py-1 font-pixel text-[7.5px] text-brand-200">
            <Lock className="h-2.5 w-2.5" /> LOCKED
          </span>
        </div>
        <h3 className="mt-4 text-[19px] font-extrabold text-ink/75">
          {pick(project.title, locale)}
        </h3>
        <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-ink/40">
          {pick(project.summary, locale)}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {pick(project.tags, locale).map((tag) => (
            <span key={tag} className="rounded-full border border-line px-2.5 py-1 text-[10.5px] font-semibold text-ink/35">
              {tag}
            </span>
          ))}
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-ink/30">
          {locale === "ar" ? "تُفتح عند توفر بيانات حقيقية" : "Unlocks with verified data"}
        </span>
      </article>
    );
  }

  return (
    <Link
      href={`/${locale}/work/${project.slug}`}
      className={cn("group block", className)}
      aria-label={`${pick(project.title, locale)} — ${project.client}`}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-4xl bg-deep",
          featured ? "aspect-[16/11]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={project.cover}
          alt={pick(project.title, locale)}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 40vw"}
          className="object-cover transition duration-[900ms] ease-smooth group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/25 to-transparent opacity-90" />

        <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/20 bg-abyss/40 px-3.5 py-1.5 text-[11px] font-bold text-white/85 backdrop-blur-md">
            {categoryLabel}
          </span>
          <span className="text-[11px] font-bold text-white/50">{project.year}</span>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              {project.client}
            </p>
            <h3
              className={cn(
                "mt-1.5 font-extrabold leading-snug text-white",
                featured ? "text-[24px] md:text-[30px]" : "text-[19px]",
              )}
            >
              {pick(project.title, locale)}
            </h3>
            {featured ? (
              <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-white/60">
                {pick(project.summary, locale)}
              </p>
            ) : null}
          </div>
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-onAccent transition duration-500 group-hover:rotate-45">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {pick(project.tags, locale).slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line bg-surface px-3 py-1 text-[11.5px] font-semibold text-ink/50 transition group-hover:border-brand-400/40 group-hover:text-brand-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
