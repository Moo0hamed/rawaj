import type { Localized } from "@/lib/i18n";

/**
 * بيانات الشركة الأساسية.
 * ملاحظة: بيانات التواصل والاسم التجاري هنا تُعد قيمًا تأسيسية قابلة للاستبدال
 * ببيانات العميل الحقيقية من هذا الملف فقط (بدون تعديل أي مكوّن).
 */
export const siteConfig = {
  name: "رَواج",
  nameEn: "RAWAJ",
  legalName: "RAWAJ Digital Marketing",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rawaj.example.com",
  tagline: {
    ar: "نسوّق علامتك… فتصبح حديث السوق",
    en: "We market your brand until it becomes the talk of the market",
  } satisfies Localized,
  description: {
    ar: "رَواج وكالة تسويق رقمي متكاملة: استراتيجيات نمو، إدارة صفحات التواصل الاجتماعي، صناعة محتوى مرئي، تصوير ومونتاج، وبناء هويات بصرية تصنع فرقًا.",
    en: "RAWAJ is a full-service digital marketing agency: growth strategy, social media management, visual content, photo & video production, and brand identity design.",
  } satisfies Localized,
  email: "123ONETWO123123@GMAIL.COM",
  phone: "01024345291",
  whatsapp: "01024345291",
  address: {
    ar: "شبين الكوم، المنوفية، مصر",
    en: "Shebin El-Kom, Menoufia, Egypt",
  } satisfies Localized,
  workingHours: {
    ar: "الأحد – الخميس · 9 ص – 6 م",
    en: "Sun – Thu · 9 AM – 6 PM",
  } satisfies Localized,
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/",
    tiktok: "https://tiktok.com/",
    behance: "https://behance.net/",
  },
  founded: 2019,
} as const;

export const stats = [
  { value: 120, suffix: "+", label: { ar: "مشروع منفَّذ", en: "Projects delivered" } },
  { value: 45, suffix: "+", label: { ar: "علامة تجارية", en: "Brands served" } },
  { value: 6, suffix: "", label: { ar: "سنوات خبرة", en: "Years of expertise" } },
  { value: 98, suffix: "%", label: { ar: "رضا العملاء", en: "Client satisfaction" } },
] satisfies { value: number; suffix: string; label: Localized }[];
