import type { Localized } from "@/lib/i18n";

export type Member = {
  slug: string;
  name: Localized;
  role: Localized;
  bio: Localized;
  image?: string;
  level: number;
  classTag: Localized;
};

/**
 * أعضاء الفريق الأساسيون.
 * الأدوار والتخصص والنبذة والصور قابلة للتعديل — لا تُضاف بيانات غير مؤكدة.
 */
export const team: Member[] = [
  {
    slug: "sobhi-saqr",
    name: { ar: "صبحي سقر", en: "Sobhi Saqr" },
    role: { ar: "التخصص: هيتضاف قريبًا", en: "Specialty: to be added" },
    bio: {
      ar: "النبذة والصورة هتتضاف قريبًا. البيانات تُدار من هذا الملف فقط — بدون اختراع أدوار.",
      en: "Bio and photo will be added soon. Data is managed from this file only — no invented roles.",
    },
    level: 1,
    classTag: { ar: "لاعب أساسي", en: "Core player" },
  },
  {
    slug: "mohamed-amer",
    name: { ar: "محمد عامر", en: "Mohamed Amer" },
    role: { ar: "التخصص: هيتضاف قريبًا", en: "Specialty: to be added" },
    bio: {
      ar: "النبذة والصورة هتتضاف قريبًا. البيانات تُدار من هذا الملف فقط — بدون اختراع أدوار.",
      en: "Bio and photo will be added soon. Data is managed from this file only — no invented roles.",
    },
    level: 1,
    classTag: { ar: "لاعب أساسي", en: "Core player" },
  },
];

export const teamSlots = {
  title: { ar: "لاعب جديد قريبًا", en: "New player coming soon" },
  body: {
    ar: "خانة جاهزة لأي عضو جديد: الاسم، الدور، الصورة، والنبذة بتتضاف من هذا الملف.",
    en: "A slot ready for a new member: name, role, photo, and bio are all managed from this file.",
  },
};