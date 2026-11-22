import type { Localized } from "@/lib/i18n";

export type ProjectCategory = "branding" | "social" | "ads" | "production";

export type Project = {
  slug: string;
  client: string;
  category: ProjectCategory;
  year: number;
  cover: string;
  gallery: string[];
  title: Localized;
  summary: Localized;
  challenge: Localized;
  approach: Localized<string[]>;
  results: { value: string; label: Localized }[];
  tags: Localized<string[]>;
  locked?: boolean;
};

/**
 * مهمات العمل (Missions).
 * لا تُضاف أسماء عملاء أو أرقام نتائج غير موثقة.
 * كل مهمة مقفولة تُفتح بإضافة بيانات حقيقية من العميل إلى هذا الملف.
 */
export const projects: Project[] = [
  {
    slug: "qahwa-house",
    client: "—",
    category: "branding",
    year: 2026,
    cover: "/images/project-qahwa-cover.jpg",
    gallery: [],
    locked: true,
    title: { ar: "مهمة الهوية — قيد النشر", en: "Identity mission — publishing soon" },
    summary: {
      ar: "ملف مهمة هوية جاهز للفتح عند توفر بيانات العميل والنتائج الموثقة.",
      en: "An identity mission file, ready to unlock once client data and verified results are available.",
    },
    challenge: {
      ar: "هذه الخانة مخصصة لمهمة هوية بصرية حقيقية. تُضاف التفاصيل من ملف المشاريع فقط بعد موافقة العميل وتوثيق النتائج.",
      en: "This slot is reserved for a real brand identity mission. Details are added from the projects file only after client approval and verified results.",
    },
    approach: { ar: [], en: [] },
    results: [],
    tags: {
      ar: ["هوية بصرية", "تصميم"],
      en: ["Brand identity", "Design"],
    },
  },
  {
    slug: "lumi-skin",
    client: "—",
    category: "ads",
    year: 2026,
    cover: "/images/project-lumi-cover.jpg",
    gallery: [],
    locked: true,
    title: { ar: "مهمة إعلانات — قيد النشر", en: "Ads mission — publishing soon" },
    summary: {
      ar: "خانة مهمة حملات مدفوعة، بدون أي أرقام أو عملاء غير موثقين.",
      en: "A paid-campaign mission slot, with no unverified numbers or clients.",
    },
    challenge: {
      ar: "تُفتح هذه المهمة بإضافة تفاصيل الحملة الحقيقية: الهدف، الميزانية، والنتائج الموثقة من منصات الإعلان.",
      en: "This mission unlocks when real campaign details are added: goal, budget, and results verified from ad platforms.",
    },
    approach: { ar: [], en: [] },
    results: [],
    tags: {
      ar: ["حملات إعلانية", "أداء"],
      en: ["Paid campaigns", "Performance"],
    },
  },
  {
    slug: "ofoq-real-estate",
    client: "—",
    category: "production",
    year: 2026,
    cover: "/images/project-ofoq-cover.jpg",
    gallery: [],
    locked: true,
    title: { ar: "مهمة إنتاج — قيد النشر", en: "Production mission — publishing soon" },
    summary: {
      ar: "خانة مهمة تصوير وفيلم إطلاق، بانتظار بيانات المشروع الحقيقية.",
      en: "A photo and launch-film mission slot, waiting for real project data.",
    },
    challenge: {
      ar: "تُضاف تفاصيل المهمة (العميل، نطاق التصوير، والنتائج) بعد اكتمال التنفيذ والحصول على إذن النشر.",
      en: "Mission details (client, shoot scope, and results) are added after delivery and publishing approval.",
    },
    approach: { ar: [], en: [] },
    results: [],
    tags: {
      ar: ["إنتاج فيديو", "تصوير"],
      en: ["Video production", "Photography"],
    },
  },
  {
    slug: "nabd-fitness",
    client: "—",
    category: "social",
    year: 2026,
    cover: "/images/project-nabd-cover.jpg",
    gallery: [],
    locked: true,
    title: { ar: "مهمة سوشيال — قيد النشر", en: "Social mission — publishing soon" },
    summary: {
      ar: "خانة مهمة إدارة مجتمع، تُفتح عند توفر أرقام تفاعل حقيقية.",
      en: "A community-management slot, unlocked when real engagement numbers are available.",
    },
    challenge: {
      ar: "لا تُنشر أي أرقام تفاعل قبل تصديرها من منصات العميل ومقارنتها بفترة سابقة.",
      en: "No engagement numbers are published before they are exported from client platforms and compared to a prior period.",
    },
    approach: { ar: [], en: [] },
    results: [],
    tags: {
      ar: ["إدارة سوشيال", "محتوى"],
      en: ["Social management", "Content"],
    },
  },
  {
    slug: "dar-fashion",
    client: "—",
    category: "branding",
    year: 2026,
    cover: "/images/project-dar-cover.jpg",
    gallery: [],
    locked: true,
    title: { ar: "مهمة هوية — قيد النشر", en: "Identity mission — publishing soon" },
    summary: {
      ar: "خانة ثانية لمهمة هوية، جاهزة لاستقبال ملف عميل جديد.",
      en: "A second identity mission slot, ready for a new client file.",
    },
    challenge: {
      ar: "تُملأ الخانة بنطاق العمل الفعلي ودليل الهوية عند اعتماد العميل للنشر.",
      en: "The slot is filled with the real scope and brand guide once the client approves publishing.",
    },
    approach: { ar: [], en: [] },
    results: [],
    tags: {
      ar: ["هوية", "دليل علامة"],
      en: ["Identity", "Brand guide"],
    },
  },
  {
    slug: "mada-dining",
    client: "—",
    category: "production",
    year: 2026,
    cover: "/images/project-mada-cover.jpg",
    gallery: [],
    locked: true,
    title: { ar: "مهمة تصوير — قيد النشر", en: "Photo mission — publishing soon" },
    summary: {
      ar: "خانة مهمة تصوير منتجات، بدون صور أو ادعاءات غير موثقة.",
      en: "A product photography slot, with no unverified images or claims.",
    },
    challenge: {
      ar: "تُضاف الصور النهائية وأرقام الأداء من ملف العميل فقط بعد الموافقة.",
      en: "Final images and performance numbers are added from the client file only after approval.",
    },
    approach: { ar: [], en: [] },
    results: [],
    tags: {
      ar: ["تصوير منتجات", "محتوى"],
      en: ["Product photo", "Content"],
    },
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
