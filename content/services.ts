import type { Localized } from "@/lib/i18n";

export type ServiceIcon =
  | "strategy"
  | "social"
  | "content"
  | "camera"
  | "brand"
  | "megaphone";

export type Service = {
  slug: string;
  icon: ServiceIcon;
  title: Localized;
  short: Localized;
  intro: Localized;
  description: Localized<string[]>;
  features: Localized<{ title: string; body: string }[]>;
  deliverables: Localized<string[]>;
  image: string;
};

export const services: Service[] = [
  {
    slug: "digital-marketing",
    icon: "strategy",
    title: { ar: "التسويق الرقمي", en: "Digital Marketing" },
    short: {
      ar: "استراتيجيات نمو مبنية على البيانات، لا على التخمين.",
      en: "Data-driven growth strategies, never guesswork.",
    },
    intro: {
      ar: "نبني خارطة طريق تسويقية واضحة لعلامتك: من تحليل السوق والجمهور، إلى توزيع الميزانية، إلى قياس كل ريال تعيده الحملة.",
      en: "We build a clear marketing roadmap for your brand — from market and audience analysis, to budget allocation, to measuring every pound your campaign returns.",
    },
    description: {
      ar: [
        "التسويق الرقمي عند رَواج ليس نشرًا عشوائيًا ولا حملات تُدار بالحدس. نبدأ بفهم دقيق لجمهورك ومنافسيك، ثم نصمم مسار تحويل كامل يقود الزائر من أول انطباع حتى قرار الشراء.",
        "نعمل بمنهجية دورية: تحليل، تنفيذ، قياس، تحسين. وكل تقرير يصلك بأرقام واضحة تربط الإنفاق بالنتيجة، لتعرف بالضبط أين تنجح حملاتك وأين تحتاج إلى تعديل.",
      ],
      en: [
        "Digital marketing at RAWAJ is not random posting or campaigns run on instinct. We start with a precise understanding of your audience and competitors, then design a full conversion path from first impression to purchase decision.",
        "We work in cycles: analyze, execute, measure, optimize. Every report gives you clear numbers tying spend to outcome, so you know exactly where campaigns are working and where they need adjustment.",
      ],
    },
    features: {
      ar: [
        { title: "تحليل السوق والمنافسين", body: "دراسة معمّقة للفجوات والفرص قبل أي إنفاق إعلاني." },
        { title: "استراتيجية قنوات", body: "اختيار المنصات التي يتواجد فيها جمهورك فعلًا، وتجاهل ما لا يخدم الهدف." },
        { title: "قياس وتحسين مستمر", body: "لوحة مؤشرات شهرية وقرارات تحسين مبنية على الأداء الحقيقي." },
      ],
      en: [
        { title: "Market & competitor analysis", body: "A deep study of gaps and opportunities before any ad spend." },
        { title: "Channel strategy", body: "We pick the platforms your audience actually uses — and skip the rest." },
        { title: "Continuous measurement", body: "A monthly KPI dashboard and optimization decisions based on real performance." },
      ],
    },
    deliverables: {
      ar: ["خطة تسويق ربع سنوية", "تقرير أداء شهري", "لوحة مؤشرات KPI", "اجتماع مراجعة استراتيجي"],
      en: ["Quarterly marketing plan", "Monthly performance report", "KPI dashboard", "Strategic review session"],
    },
    image:
      "/images/service-digital-marketing.jpg",
  },
  {
    slug: "social-media",
    icon: "social",
    title: { ar: "إدارة وتطوير صفحات التواصل", en: "Social Media Management" },
    short: {
      ar: "حضور يومي متّسق يحوّل المتابعين إلى عملاء.",
      en: "A consistent daily presence that turns followers into customers.",
    },
    intro: {
      ar: "نتولى صفحاتك من الخطة الشهرية إلى الرد على التعليقات، بلهجة علامة ثابتة وتصميم يجعل التمرير يتوقف.",
      en: "We run your pages from the monthly plan to comment replies, with a consistent brand voice and design that stops the scroll.",
    },
    description: {
      ar: [
        "ندير صفحاتك كمنتج له هدف: بناء مجتمع يثق بعلامتك. نضع خطة محتوى شهرية موزعة على أنواع المحتوى، ونصمم هوية بصرية موحّدة للمنشورات، ونكتب نصوصًا بلغة جمهورك.",
        "لا نكتفي بالنشر: نراقب التفاعل، نرد على الرسائل، نقرأ التعليقات كمصدر أبحاث، ونحوّل النقاشات إلى فرص بيع حقيقية عبر الرسائل المباشرة.",
      ],
      en: [
        "We manage your pages as a product with a purpose: building a community that trusts your brand. We create a monthly content plan across content types, design a unified visual identity for posts, and write in your audience's language.",
        "We go beyond publishing: we monitor engagement, reply to messages, read comments as research, and turn conversations into real sales opportunities through DMs.",
      ],
    },
    features: {
      ar: [
        { title: "خطة محتوى شهرية", body: "تقويم واضح بأنواع المحتوى وأوقات النشر والهدف من كل منشور." },
        { title: "هوية بصرية للمنشورات", body: "قوالب مصممة خصيصًا لعلامتك تجعل حسابك متسقًا ومميزًا." },
        { title: "تفاعل وإدارة مجتمع", body: "ردود سريعة، إدارة رسائل، ورصد لما يقوله جمهورك عنك." },
      ],
      en: [
        { title: "Monthly content plan", body: "A clear calendar of content types, posting times, and the goal of every post." },
        { title: "Visual identity for posts", body: "Custom templates that keep your feed consistent and recognizable." },
        { title: "Community management", body: "Fast replies, inbox handling, and monitoring of what your audience says." },
      ],
    },
    deliverables: {
      ar: ["12–20 منشورًا شهريًا", "تقويم محتوى", "تصميمات منشورات وستوري", "تقرير نمو شهري"],
      en: ["12–20 posts per month", "Content calendar", "Post & story designs", "Monthly growth report"],
    },
    image:
      "/images/service-social-media.jpg",
  },
  {
    slug: "content-creation",
    icon: "content",
    title: { ar: "صناعة المحتوى المرئي", en: "Visual Content Creation" },
    short: {
      ar: "محتوى يجعل علامتك تُشاهد… ثم تُتذكّر.",
      en: "Content that gets your brand watched — then remembered.",
    },
    intro: {
      ar: "من الفكرة والسيناريو إلى المونتاج النهائي، ننتج محتوى مرئيًا يناسب المنصة والجمهور والهدف.",
      en: "From concept and script to final edit, we produce visual content tailored to the platform, the audience, and the goal.",
    },
    description: {
      ar: [
        "المحتوى المرئي هو اللغة الأولى اليوم. نصنع فيديوهات قصيرة، إعلانات، ومحتوى تعليميًا وترفيهيًا يبني ارتباطًا عاطفيًا بين جمهورك وعلامتك.",
        "نبدأ دائمًا من رسالة واضحة: ماذا نريد أن يشعر به المشاهد بعد 15 ثانية؟ من هذه الرسالة نبني السيناريو، اللقطات، الموسيقى، والمونتاج.",
      ],
      en: [
        "Visual content is today's first language. We create short videos, ads, and educational and entertaining content that builds an emotional connection between your audience and your brand.",
        "We always start from a clear message: what do we want the viewer to feel after 15 seconds? From that message we build the script, shots, music, and edit.",
      ],
    },
    features: {
      ar: [
        { title: "كتابة سيناريو", body: "أفكار مكتوبة بهدف واضح وخطاف في أول ثلاث ثوانٍ." },
        { title: "إنتاج احترافي", body: "تصوير ومونتاج ومعالجة صوتية بمعايير منصات اليوم." },
        { title: "تعدد الصيغ", body: "نسخ رأسية وأفقية ومربعة جاهزة لكل منصة." },
      ],
      en: [
        { title: "Scriptwriting", body: "Ideas written with a clear goal and a hook in the first three seconds." },
        { title: "Professional production", body: "Filming, editing, and sound that meet today's platform standards." },
        { title: "Multi-format delivery", body: "Vertical, horizontal, and square versions ready for every platform." },
      ],
    },
    deliverables: {
      ar: ["Reels / Shorts شهريًا", "فيديوهات إعلانية", "نسخ متعددة للمنصات", "أرشيف ملفات المصدر"],
      en: ["Monthly Reels / Shorts", "Ad videos", "Platform-specific cuts", "Source files archive"],
    },
    image:
      "/images/service-content.jpg",
  },
  {
    slug: "photo-video",
    icon: "camera",
    title: { ar: "التصوير والمونتاج", en: "Photography & Video" },
    short: {
      ar: "صور ولقطات بجودة تحمل قيمة علامتك.",
      en: "Photos and footage with quality worthy of your brand.",
    },
    intro: {
      ar: "جلسات تصوير للمنتجات والأشخاص والأماكن، ومونتاج يمنح المادة الخام روحًا وقصة.",
      en: "Product, people, and location shoots, with editing that gives raw material a soul and a story.",
    },
    description: {
      ar: [
        "نصوّر بمنطق الاستخدام: كل صورة أو لقطة تُنتج لتخدم منصة محددة ورسالة محددة، لا لمجرد ملء المعرض.",
        "بعد التصوير نتولى اختيار المادة، تصحيح الألوان، المونتاج، والموسيقى، ونسلّمك مكتبة أصول جاهزة لإعادة الاستخدام في حملاتك القادمة.",
      ],
      en: [
        "We shoot with purpose: every photo or clip is produced for a specific platform and message, not just to fill a gallery.",
        "After the shoot we handle selection, color grading, editing, and music — delivering an asset library ready for reuse in future campaigns.",
      ],
    },
    features: {
      ar: [
        { title: "تصوير منتجات", body: "إضاءة استوديو وتنسيق يبرز تفاصيل المنتج وجودته." },
        { title: "تصوير أشخاص", body: "جلسات للفريق أو المؤثرين بأسلوب عفوي واحترافي." },
        { title: "مونتاج ومعالجة", body: "قصّ، تصحيح ألوان، موسيقى، وتصدير بجميع المقاسات." },
      ],
      en: [
        { title: "Product photography", body: "Studio lighting and styling that highlight product detail and quality." },
        { title: "People photography", body: "Team or influencer sessions with a natural, professional style." },
        { title: "Editing & grading", body: "Cutting, color correction, music, and export in all sizes." },
      ],
    },
    deliverables: {
      ar: ["جلسة تصوير مخططة", "مكتبة صور معالجة", "فيديو ترويجي", "ملفات مصدر منظمة"],
      en: ["Planned photo session", "Retouched photo library", "Promotional video", "Organized source files"],
    },
    image:
      "/images/service-photo.jpg",
  },
  {
    slug: "branding",
    icon: "brand",
    title: { ar: "بناء الهوية البصرية", en: "Brand Identity" },
    short: {
      ar: "هوية متكاملة تجعل علامتك تُعرف من أول نظرة.",
      en: "A complete identity that makes your brand recognizable at a glance.",
    },
    intro: {
      ar: "نحوّل قيم علامتك إلى نظام بصري: شعار، ألوان، خطوط، وقواعد استخدام متسقة.",
      en: "We translate your brand values into a visual system: logo, colors, typography, and consistent usage rules.",
    },
    description: {
      ar: [
        "الهوية ليست شعارًا فقط. هي الطريقة التي تتحدث بها علامتك وتظهر بها في كل نقطة تواصل: من التغليف إلى المنشور إلى واجهة المتجر.",
        "نبني دليل هوية عمليًا وسهل التطبيق، حتى يستطيع أي فريق داخل شركتك استخدامه دون أن تفقد العلامة اتساقها.",
      ],
      en: [
        "An identity is more than a logo. It's how your brand speaks and appears at every touchpoint: from packaging to posts to your storefront.",
        "We build a practical, easy-to-apply brand guide so any team inside your company can use it without the brand losing consistency.",
      ],
    },
    features: {
      ar: [
        { title: "استراتيجية العلامة", body: "تحديد الجمهور، الوعد، والشخصية قبل رسم أي خط." },
        { title: "تصميم الهوية", body: "شعار، لوحة ألوان، خطوط، وأنماط مرئية متكاملة." },
        { title: "دليل الهوية", body: "ملف قواعد واضح يضمن الاتساق في كل التطبيقات." },
      ],
      en: [
        { title: "Brand strategy", body: "Defining audience, promise, and personality before drawing a single line." },
        { title: "Identity design", body: "Logo, color palette, typography, and a complete visual system." },
        { title: "Brand guidelines", body: "A clear rules document that keeps every application consistent." },
      ],
    },
    deliverables: {
      ar: ["شعار ونسخه", "لوحة ألوان وخطوط", "دليل هوية PDF", "قوالب سوشيال ومطبوعات"],
      en: ["Logo & variations", "Color & type system", "Brand guideline PDF", "Social & print templates"],
    },
    image:
      "/images/service-branding.jpg",
  },
  {
    slug: "promotion",
    icon: "megaphone",
    title: { ar: "الترويج والحملات الإعلانية", en: "Promotion & Ad Campaigns" },
    short: {
      ar: "حملات مدفوعة تصل للجمهور المناسب بأقل تكلفة.",
      en: "Paid campaigns that reach the right audience at the lowest cost.",
    },
    intro: {
      ar: "نخطط وننفذ حملات إعلانية على Meta وTikTok وGoogle، مع اختبارات مستمرة للوصول إلى أفضل نتيجة.",
      en: "We plan and run ad campaigns on Meta, TikTok, and Google, with continuous testing to reach the best result.",
    },
    description: {
      ar: [
        "الإعلان الجيد ليس الأعلى ميزانية، بل الأدق استهدافًا والأقوى رسالة. نختبر الجمهور، الرسالة، والتصميم قبل أن نضاعف الإنفاق على ما ينجح.",
        "ننشئ نظام اختبارات A/B مستمرًا، ونراقب تكلفة النتيجة ومعدل التحويل، ونقدم لك تقارير مفهومة لا تحتاج خبرة إعلانية لقراءتها.",
      ],
      en: [
        "A good ad isn't the biggest budget — it's the sharpest targeting and strongest message. We test audience, message, and creative before scaling what works.",
        "We run a continuous A/B testing system, monitor cost-per-result and conversion rate, and deliver reports you can understand without an advertising background.",
      ],
    },
    features: {
      ar: [
        { title: "بناء الحملات", body: "هيكلة الحملات والمجموعات الإعلانية حسب الهدف والجمهور." },
        { title: "اختبارات إبداعية", body: "نسخ متعددة من التصميم والنص للوصول إلى الأفضل أداءً." },
        { title: "تحسين التكلفة", body: "إدارة الميزانية لتحقيق أفضل عائد على الإنفاق الإعلاني." },
      ],
      en: [
        { title: "Campaign setup", body: "Structuring campaigns and ad sets around goal and audience." },
        { title: "Creative testing", body: "Multiple design and copy variants to find the top performer." },
        { title: "Cost optimization", body: "Budget management for the best return on ad spend." },
      ],
    },
    deliverables: {
      ar: ["خطة إعلانية", "إدارة حملات Meta / TikTok / Google", "تقارير ROAS", "تحسينات أسبوعية"],
      en: ["Media plan", "Meta / TikTok / Google management", "ROAS reports", "Weekly optimizations"],
    },
    image:
      "/images/service-ads.jpg",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
