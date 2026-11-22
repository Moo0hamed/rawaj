import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/site";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const lastModified = new Date();

  const staticPaths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/work", priority: 0.9, changeFrequency: "weekly" },
    { path: "/team", priority: 0.7, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/campaign", priority: 1, changeFrequency: "weekly" },
    { path: "/play", priority: 0.4, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      priority: 0.75,
      changeFrequency: "monthly" as const,
    })),
    ...projects.map((project) => ({
      path: `/work/${project.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];

  return staticPaths.flatMap((entry) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${entry.path}`,
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: {
          ar: `${base}/ar${entry.path}`,
          en: `${base}/en${entry.path}`,
        },
      },
    })),
  );
}
