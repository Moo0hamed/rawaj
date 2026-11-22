import type { Localized } from "@/lib/i18n";

export type Plan = {
  slug: string;
  name: Localized;
  tagline: Localized;
  monthlyPrice: number;
  highlighted?: boolean;
  badge?: Localized;
  features: Localized<string[]>;
  extra?: Localized<string>;
};

export const plans: Plan[] = [
  {
    slug: "launch",
    name: { ar: "باقة الانطلاق", en: "Launch" },
    tagline: {
      ar: "لعلامة تبدأ حضورها وتبني أساسًا بصريًا ثابتًا.",
      en: "For a brand starting its presence and building a stable visual base.",
    },
    monthlyPrice: 9500,
    features: {
      ar: [
        "إدارة منصتين اجتماعيتين",
        "12 منشورًا + 4 ريلز شهريًا",
        "تصميم منشورات وستوري",
        "خطة محتوى شهرية",
        "تقرير أداء شهري",
        "دعم عبر واتساب خلال أيام العمل",
      ],
      en: [
        "Management of two social platforms",
        "12 posts + 4 reels per month",
        "Post and story design",
        "Monthly content plan",
        "Monthly performance report",
        "WhatsApp support on business days",
      ],
    },
  },
  {
    slug: "growth",
    name: { ar: "باقة النمو", en: "Growth" },
    tagline: {
      ar: "الأكثر اختيارًا: محتوى وإعلانات معًا لتحقيق نمو قابل للقياس.",
      en: "Most chosen: content and ads together for measurable growth.",
    },
    monthlyPrice: 18500,
    highlighted: true,
    badge: { ar: "الأكثر طلبًا", en: "Most popular" },
    features: {
      ar: [
        "إدارة 3 منصات اجتماعية",
        "20 منشورًا + 8 ريلز شهريًا",
        "إدارة حملات إعلانية حتى 20,000 ج.م ميزانية",
        "جلسة تصوير قصيرة شهريًا",
        "تحسينات إعلانية أسبوعية",
        "تقرير أداء + اجتماع استراتيجي شهري",
        "مدير حساب مخصص",
      ],
      en: [
        "Management of three social platforms",
        "20 posts + 8 reels per month",
        "Ad management up to EGP 20,000 budget",
        "Short monthly photo session",
        "Weekly ad optimizations",
        "Performance report + monthly strategy call",
        "Dedicated account manager",
      ],
    },
  },
  {
    slug: "scale",
    name: { ar: "باقة الريادة", en: "Scale" },
    tagline: {
      ar: "لفرق تسويق تحتاج شريكًا كاملًا يشغّل المحتوى والنمو.",
      en: "For marketing teams needing a full partner to run content and growth.",
    },
    monthlyPrice: 34000,
    features: {
      ar: [
        "إدارة جميع المنصات",
        "منشورات وريلز بلا سقف محدد",
        "يوم تصوير كامل شهريًا",
        "إدارة حملات حتى 60,000 ج.م ميزانية",
        "دعم الهوية البصرية والتغليف",
        "تقارير أسبوعية ومراجعة أداء",
        "أولوية تنفيذ ومدير حساب أول",
      ],
      en: [
        "All-platform management",
        "Unlimited posts and reels",
        "Full production day each month",
        "Ad management up to EGP 60,000 budget",
        "Brand identity and packaging support",
        "Weekly reports and performance reviews",
        "Priority delivery and senior account manager",
      ],
    },
    extra: {
      ar: "تشمل جلسة استراتيجية ربع سنوية مع الإدارة.",
      en: "Includes a quarterly strategy session with leadership.",
    },
  },
];

export const pricingNotes: Localized<string[]> = {
  ar: [
    "الأسعار بالجنيه المصري ولا تشمل ضريبة القيمة المضافة.",
    "ميزانية الإعلانات منفصلة عن قيمة الباقة وتُدفع مباشرة للمنصات.",
    "يمكن ترقية أو تعديل الباقة شهريًا حسب احتياج علامتك.",
  ],
  en: [
    "Prices are in EGP and exclude VAT.",
    "Ad spend is separate from the plan and paid directly to platforms.",
    "Plans can be upgraded or adjusted monthly to fit your brand.",
  ],
};

export const faqs: { question: Localized; answer: Localized }[] = [
  {
    question: {
      ar: "هل يمكنني البدء بباقة صغيرة ثم الترقية؟",
      en: "Can I start with a small plan and upgrade later?",
    },
    answer: {
      ar: "نعم. معظم عملائنا يبدأون بباقة الانطلاق، ثم ينتقلون إلى النمو بعد أول تقرير أداء يوضح الفرص الأكبر.",
      en: "Yes. Most clients start with Launch, then move to Growth after the first performance report reveals the bigger opportunities.",
    },
  },
  {
    question: {
      ar: "ماذا لو لم أكن أملك هوية بصرية بعد؟",
      en: "What if I don't have a brand identity yet?",
    },
    answer: {
      ar: "نبدأ بمشروع هوية مستقل قبل أو بالتوازي مع باقة المحتوى، حتى لا تُبنى المنشورات على أساس بصري مؤقت.",
      en: "We start with a standalone identity project before or alongside the content plan, so posts aren't built on a temporary visual base.",
    },
  },
  {
    question: {
      ar: "هل ميزانية الإعلانات مشمولة في السعر؟",
      en: "Is ad spend included in the price?",
    },
    answer: {
      ar: "لا. قيمة الباقة تشمل الإدارة والتصميم والتحسين، أما الإنفاق الإعلاني فيُدفع مباشرة إلى المنصات لتظل الملكية لك.",
      en: "No. The plan covers management, creative, and optimization; ad spend is paid directly to the platforms so ownership stays with you.",
    },
  },
  {
    question: {
      ar: "كم يستغرق تجهيز المحتوى في البداية؟",
      en: "How long does the initial content setup take?",
    },
    answer: {
      ar: "من 7 إلى 10 أيام عمل لجلسة الاستكشاف، خطة المحتوى الأولى، وتجهيز القوالب البصرية قبل بدء النشر.",
      en: "Seven to ten business days for the discovery session, first content plan, and visual templates before publishing begins.",
    },
  },
];
