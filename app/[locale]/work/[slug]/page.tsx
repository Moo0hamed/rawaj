import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrows";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getProject, projects } from "@/content/projects";
import { getDictionary } from "@/content/dictionaries";
import { siteConfig } from "@/content/site";
import { isLocale, locales, pick, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: pick(project.title, locale),
    description: pick(project.summary, locale),
    alternates: {
      canonical: `/${locale}/work/${slug}`,
      languages: { ar: `/ar/work/${slug}`, en: `/en/work/${slug}` },
    },
    openGraph: {
      title: pick(project.title, locale),
      description: pick(project.summary, locale),
      images: [{ url: project.cover, width: 1600, height: 900, alt: pick(project.title, locale) }],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const project = getProject(slug);
  if (!project) notFound();

  const title = pick(project.title, locale);
  const others = projects.filter((item) => item.slug !== project.slug).slice(0, 2);

  const info = [
    { label: dict.workPage.detail.client, value: project.client },
    { label: dict.workPage.detail.category, value: dict.workPage.categories[project.category] },
    { label: dict.workPage.detail.year, value: String(project.year) },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        label={dict.workPage.categories[project.category]}
        title={title}
        body={pick(project.summary, locale)}
        crumbs={[
          { label: dict.nav.work, href: `/${locale}/work` },
          { label: project.client },
        ]}
      />

      {project.locked ? (
        <div className="shell -mt-6">
          <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-brand-400/35 bg-brand-500/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-[12.5px] font-bold text-brand-200">
              <Lock className="h-4 w-4" />
              {locale === "ar"
                ? "مهمة مقفولة — لا نعرض أرقامًا أو أسماء عملاء غير موثقة."
                : "Locked mission — we don't display unverified numbers or client names."}
            </p>
            <p className="text-[11px] text-ink/35">
              {locale === "ar"
                ? "تُفتح الخانة من ملف المحتوى عند توفر بيانات العميل الحقيقية."
                : "This slot opens from the content file once real client data is available."}
            </p>
          </div>
        </div>
      ) : null}

      <section className="relative -mt-2 bg-abyss pb-0">
        <div className="shell">
          <Reveal className="relative aspect-[16/9] overflow-hidden rounded-t-[36px] bg-deep">
            <Image
              src={project.cover}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="section bg-surface pt-14 md:pt-16">
        <div className="shell grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <div>
              <h2 className="text-[22px] font-extrabold">{dict.workPage.detail.challenge}</h2>
              <p className="mt-4 text-[16px] leading-[1.95] text-ink/65">
                {pick(project.challenge, locale)}
              </p>
            </div>

            {pick(project.approach, locale).length ? (
            <div className="mt-12">
              <h2 className="text-[22px] font-extrabold">{dict.workPage.detail.approach}</h2>
              <ul className="mt-5 space-y-4">
                {pick(project.approach, locale).map((step) => (
                  <li key={step} className="flex items-start gap-3.5">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-300">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <p className="text-[15px] leading-[1.85] text-ink/70">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
            ) : null}

            {project.gallery.length ? (
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {project.gallery.map((image, index) => (
                <Reveal key={image} delay={index * 0.06}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-paper">
                    <Image
                      src={image}
                      alt={`${title} — ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 45vw"
                      className="object-cover transition duration-700 hover:scale-[1.03]"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-4xl border border-line bg-paper p-7">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink/40">
                {dict.workPage.detail.info}
              </p>
              <dl className="mt-5 space-y-4">
                {info.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4">
                    <dt className="text-[13px] text-ink/45">{row.label}</dt>
                    <dd className="text-[13.5px] font-bold text-ink/80">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 border-t border-line pt-5">
                <p className="text-[13px] text-ink/45">{dict.workPage.detail.scope}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {pick(project.tags, locale).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {project.results.length ? (
            <div className="rounded-4xl bg-abyss p-7 text-white">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-white/40">
                {dict.workPage.detail.results}
              </p>
              <div className="mt-5 space-y-4">
                {project.results.map((result) => (
                  <div key={result.label.en} className="flex items-baseline justify-between gap-4">
                    <span className="text-[12.5px] text-white/55">
                      {pick(result.label, locale)}
                    </span>
                    <span className="text-[22px] font-black text-accent">{result.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-white/35">
                {dict.workPage.detail.resultsNote}
              </p>
            </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[22px] font-extrabold">{dict.workPage.detail.otherProjects}</h2>
            <Link
              href={`/${locale}/work`}
              className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-300 hover:text-brand-300"
            >
              {dict.workPage.all}
              <Arrow locale={locale} />
            </Link>
          </div>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {others.map((item) => (
              <ProjectCard key={item.slug} project={item} locale={locale} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={dict.workPage.ctaTitle}
        body={dict.workPage.ctaBody}
        primary={{ label: dict.contactCta.primary, href: `/${locale}/contact` }}
      />

      <BreadcrumbJsonLd
        items={[
          { name: dict.nav.home, url: `${siteConfig.url}/${locale}` },
          { name: dict.nav.work, url: `${siteConfig.url}/${locale}/work` },
          { name: project.client, url: `${siteConfig.url}/${locale}/work/${project.slug}` },
        ]}
      />
    </>
  );
}
