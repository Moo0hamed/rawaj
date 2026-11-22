import type { Localized } from "@/lib/i18n";

/** لا أسماء عملاء معروضة كحقيقية حتى تتوفر موافقات موثقة. */
export const clients: string[] = [];

export const processSteps: { title: Localized; body: Localized }[] = [
  {
    title: { ar: "اكتشاف وتحليل", en: "Discovery & analysis" },
    body: {
      ar: "جلسة استكشاف مع فريقك، وتحليل جمهورك ومنافسيك وأرقامك الحالية لبناء صورة كاملة قبل أي تنفيذ.",
      en: "A discovery session with your team, plus analysis of your audience, competitors, and current numbers before any execution.",
    },
  },
  {
    title: { ar: "استراتيجية وخطة", en: "Strategy & plan" },
    body: {
      ar: "نحوّل التحليل إلى خطة واضحة: رسائل، محتوى، قنوات، ميزانية، ومؤشرات نجاح يمكن قياسها.",
      en: "We turn analysis into a clear plan: messaging, content, channels, budget, and measurable success metrics.",
    },
  },
  {
    title: { ar: "تنفيذ وإنتاج", en: "Execution & production" },
    body: {
      ar: "تصميم، كتابة، تصوير، ومونتاج وإطلاق الحملات ضمن تقويم موثّق يصلك أسبوعيًا.",
      en: "Design, copy, shooting, editing, and campaign launch on a documented calendar delivered weekly.",
    },
  },
  {
    title: { ar: "قياس وتطوير", en: "Measure & improve" },
    body: {
      ar: "تقرير واضح كل شهر، نجتمع لنقرأ الأرقام ونقرر ما نضاعفه وما نتخلى عنه.",
      en: "A clear monthly report. We meet to read the numbers and decide what to scale and what to drop.",
    },
  },
];

export const values: { title: Localized; body: Localized }[] = [
  {
    title: { ar: "الصدق بالأرقام", en: "Honest numbers" },
    body: {
      ar: "لا نجمّل التقارير. نعرض ما نجح وما لم ينجح، لأن القرار الصحيح يبدأ من صورة حقيقية.",
      en: "We don't polish reports. We show what worked and what didn't, because the right decision starts with an honest picture.",
    },
  },
  {
    title: { ar: "الإبداع بغرض", en: "Creative with purpose" },
    body: {
      ar: "كل فكرة جميلة يجب أن تخدم هدفًا تجاريًا واضحًا، وإلا فهي مجرد زينة.",
      en: "Every beautiful idea must serve a clear business goal — otherwise it's just decoration.",
    },
  },
  {
    title: { ar: "الالتزام بالمواعيد", en: "On-time delivery" },
    body: {
      ar: "التسويق يعمل بالإيقاع. نسلّم قبل الموعد ونحمي خطتك من التأخير.",
      en: "Marketing runs on rhythm. We deliver ahead of deadlines and protect your plan from delays.",
    },
  },
  {
    title: { ar: "شراكة لا خدمة", en: "Partnership, not a service" },
    body: {
      ar: "نتعامل مع علامتك كأنها علامتنا، ونقترح ما نراه صحيحًا حتى لو لم يكن مطلوبًا منّا.",
      en: "We treat your brand as our own and suggest what we believe is right, even when it wasn't asked of us.",
    },
  },
];

export type Industry = {
  slug: string;
  name: Localized;
  icon: "food" | "health" | "realestate" | "fashion" | "tech" | "education";
  intro: Localized;
  moves: Localized<string[]>;
};

export const industries: Industry[] = [
  {
    slug: "food",
    name: { ar: "مطاعم وكافيهات", en: "Restaurants & cafés" },
    icon: "food",
    intro: {
      ar: "المطعم يُباع بالصورة قبل الطعم. نصنع محتوى يجعل الجمهور يشعر بالجوع قبل أن يقرر الزيارة.",
      en: "A restaurant sells with the image before the taste. We create content that makes people hungry before they decide to visit.",
    },
    moves: {
      ar: [
        "تصوير طعام شهري يبرز الأطباق الموسمية.",
        "محتوى قصصي عن المكان والفريق والتجربة.",
        "حملات عروض جغرافية تستهدف المحيط الفعلي.",
      ],
      en: [
        "Monthly food photography highlighting seasonal dishes.",
        "Story-driven content about the place, team, and experience.",
        "Geo-targeted offer campaigns aimed at the actual neighborhood.",
      ],
    },
  },
  {
    slug: "health",
    name: { ar: "عيادات ومراكز طبية", en: "Clinics & healthcare" },
    icon: "health",
    intro: {
      ar: "الثقة هي المنتج الحقيقي في المجال الطبي. نبنيها بمحتوى تعليمي هادئ وواضح بعيدًا عن المبالغة.",
      en: "Trust is the real product in healthcare. We build it with calm, clear educational content — no exaggeration.",
    },
    moves: {
      ar: [
        "محتوى توعوي يبني سلطة طبية للعلامة.",
        "تبسيط الخدمات في فيديوهات قصيرة.",
        "حملات حجز موجهة بقياس دقيق للتكلفة.",
      ],
      en: [
        "Educational content that builds medical authority.",
        "Simplifying services into short videos.",
        "Booking-focused campaigns with precise cost tracking.",
      ],
    },
  },
  {
    slug: "realestate",
    name: { ar: "عقارات وتطوير", en: "Real estate & development" },
    icon: "realestate",
    intro: {
      ar: "المشروع العقاري قرار كبير يحتاج إحساسًا بالمكان قبل المعاينة. نصنعه بالصورة والفيلم.",
      en: "A property is a big decision that needs a sense of place before a viewing. We create it with photography and film.",
    },
    moves: {
      ar: [
        "تصوير معماري وفيلم إطلاق للمشروع.",
        "حملات عملاء محتملين مقسمة حسب المدينة والاهتمام.",
        "محتوى يشرح قيمة الموقع وأسلوب الحياة.",
      ],
      en: [
        "Architectural photography and a launch film.",
        "Lead campaigns segmented by city and interest.",
        "Content explaining location value and lifestyle.",
      ],
    },
  },
  {
    slug: "fashion",
    name: { ar: "أزياء وتجزئة", en: "Fashion & retail" },
    icon: "fashion",
    intro: {
      ar: "في الأزياء، الاتساق البصري هو ما يرفع قيمة العلامة. نبني حضورًا يبدو كبراند لا كمتجر.",
      en: "In fashion, visual consistency is what raises brand value. We build a presence that looks like a brand, not a shop.",
    },
    moves: {
      ar: [
        "جلسات تصوير موسمية بأسلوب محرّر.",
        "هوية سوشيال متسقة عبر كل المنصات.",
        "حملات إطلاق للمجموعات الجديدة.",
      ],
      en: [
        "Seasonal editorial-style photo sessions.",
        "A consistent social identity across platforms.",
        "Launch campaigns for new collections.",
      ],
    },
  },
  {
    slug: "tech",
    name: { ar: "تقنية وشركات ناشئة", en: "Tech & startups" },
    icon: "tech",
    intro: {
      ar: "المنتج التقني قد يكون معقدًا، لكن رسالته يجب أن تكون بسيطة. نبسّط ونقيس كل خطوة.",
      en: "A tech product may be complex, but its message must be simple. We simplify and measure every step.",
    },
    moves: {
      ar: [
        "تحويل المنتج إلى قصة استخدام يومية.",
        "محتوى شرح قصير للميزات الأساسية.",
        "قمع تحويل من الوعي إلى التسجيل.",
      ],
      en: [
        "Turning the product into an everyday use story.",
        "Short explainer content for core features.",
        "A funnel from awareness to sign-up.",
      ],
    },
  },
  {
    slug: "education",
    name: { ar: "تعليم وتدريب", en: "Education & training" },
    icon: "education",
    intro: {
      ar: "التعليم يُباع بالنتيجة والطمأنينة. نصنع محتوى يوضح التحوّل الذي سيحصل عليه المتعلم.",
      en: "Education sells on outcome and reassurance. We create content that shows the transformation learners will get.",
    },
    moves: {
      ar: [
        "قصص نجاح حقيقية بصيغة فيديو قصير.",
        "محتوى مجاني يثبت خبرة المدربين.",
        "حملات تسجيل مرتبطة بمواعيد الدفعات.",
      ],
      en: [
        "Real success stories as short videos.",
        "Free content proving instructor expertise.",
        "Enrollment campaigns tied to cohort dates.",
      ],
    },
  },
];
