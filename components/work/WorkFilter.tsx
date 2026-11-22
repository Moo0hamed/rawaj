"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects as allProjects, type ProjectCategory } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Filter = "all" | ProjectCategory;

export function WorkFilter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotion();

  const projects = useMemo(
    () => (filter === "all" ? allProjects : allProjects.filter((p) => p.category === filter)),
    [filter],
  );

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: dict.workPage.all },
    { key: "branding", label: dict.workPage.categories.branding },
    { key: "social", label: dict.workPage.categories.social },
    { key: "ads", label: dict.workPage.categories.ads },
    { key: "production", label: dict.workPage.categories.production },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={dict.workPage.label}>
        {filters.map((item) => {
          const active = filter === item.key;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(item.key)}
              className={cn(
                "rounded-full border px-4 py-2.5 text-[13px] font-bold transition duration-300",
                active
                  ? "border-ink bg-abyss text-white"
                  : "border-line bg-surface text-ink/55 hover:border-ink/25 hover:text-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {projects.map((project) => (
            <motion.div
              key={project.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={filter === "all" && project.slug === allProjects[0].slug ? "lg:col-span-2" : ""}
            >
              <ProjectCard
                project={project}
                locale={locale}
                dict={dict}
                featured={filter === "all" && project.slug === allProjects[0].slug}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 text-center text-[14px] text-ink/45">{dict.workPage.empty}</p>
      ) : null}
    </div>
  );
}
