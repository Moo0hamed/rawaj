import type { Localized } from "@/lib/i18n";

export type StageId =
  | "identity"
  | "strategy"
  | "social"
  | "ads"
  | "replay"
  | "team"
  | "launch"
  | "boss";

export type StageDef = {
  id: StageId;
  code: string;
  title: Localized;
  tagline: Localized;
  serviceSlug?: string;
  xp: number;
  coins: number;
};

export const stages: StageDef[] = [
  {
    id: "identity",
    code: "STAGE 01",
    title: { ar: "الهوية", en: "Identity" },
    tagline: {
      ar: "اسم براندك وألوانه من لوحة رَواج، وأول تعريف بعلامتك.",
      en: "Your brand name, RAWAJ-palette colors, and your first brand definition.",
    },
    serviceSlug: "branding",
    xp: 20,
    coins: 3,
  },
  {
    id: "strategy",
    code: "STAGE 02",
    title: { ar: "الاستراتيجية", en: "Strategy" },
    tagline: {
      ar: "رتّب خطة التسويق: الجمهور، الهدف، القناة، الميزانية.",
      en: "Sequence the plan: audience, goal, channel, budget.",
    },
    serviceSlug: "digital-marketing",
    xp: 20,
    coins: 3,
  },
  {
    id: "social",
    code: "STAGE 03",
    title: { ar: "المحتوى والسوشيال", en: "Content & Social" },
    tagline: {
      ar: "ابنِ تقويم نشر أسبوعي يرفع تفاعل الجمهور.",
      en: "Build a weekly content calendar that lifts engagement.",
    },
    serviceSlug: "social-media",
    xp: 20,
    coins: 3,
  },
  {
    id: "ads",
    code: "STAGE 04",
    title: { ar: "الإعلانات", en: "Ads" },
    tagline: {
      ar: "وزّع ميزانية افتراضية وشاهد وصولًا ونقرات ومبيعات تقديرية.",
      en: "Allocate a virtual budget and watch estimated reach, clicks, and sales.",
    },
    serviceSlug: "promotion",
    xp: 20,
    coins: 3,
  },
  {
    id: "replay",
    code: "STAGE 05",
    title: { ar: "غرفة العرض", en: "Replay Room" },
    tagline: {
      ar: "شاهد أعمال رَواج الموثقة عندما تتوفر.",
      en: "Watch verified RAWAJ work when it becomes available.",
    },
    serviceSlug: "content-creation",
    xp: 50,
    coins: 0,
  },
  {
    id: "team",
    code: "STAGE 06",
    title: { ar: "الفريق", en: "The Team" },
    tagline: {
      ar: "تعرّف على الفريق الحقيقي خلف رَواج.",
      en: "Meet the real team behind RAWAJ.",
    },
    xp: 10,
    coins: 0,
  },
  {
    id: "launch",
    code: "STAGE 07",
    title: { ar: "الإطلاق", en: "Launch" },
    tagline: {
      ar: "لحظة النجاح وتقرير براند شخصي مبني على قراراتك.",
      en: "The win moment and a personal brand report built from your choices.",
    },
    xp: 40,
    coins: 5,
  },
  {
    id: "boss",
    code: "BOSS LEVEL",
    title: { ar: "ابدأ مشروعك الحقيقي", en: "Start your real project" },
    tagline: {
      ar: "براندك جاهز. تواصل مع رَواج وابدأ التنفيذ.",
      en: "Your brand is ready. Contact RAWAJ and start executing.",
    },
    xp: 30,
    coins: 0,
  },
];

export const palette = [
  { hex: "#2391FF", name: { ar: "أزرق رَواج", en: "RAWAJ blue" } },
  { hex: "#FFF83F", name: { ar: "أصفر رَواج", en: "RAWAJ yellow" } },
  { hex: "#E9F1FF", name: { ar: "أبيض ثلجي", en: "Ice white" } },
  { hex: "#040B14", name: { ar: "ليل عميق", en: "Deep night" } },
] satisfies { hex: string; name: Localized }[];

export const identityCopy = {
  ask: { ar: "اسم براندك إيه؟", en: "What's your brand name?" },
  placeholder: { ar: "مثال: نُقطة", en: "e.g. Noqta" },
  paletteLabel: { ar: "اختار لغاية 3 ألوان من هوية رَواج", en: "Pick up to 3 colors from RAWAJ's identity" },
  preview: { ar: "معاينة بطاقة البراند", en: "Brand card preview" },
  cta: { ar: "اعتمد الهوية", en: "Lock the identity" },
  errorName: { ar: "اكتب اسم براند من حرفين على الأقل.", en: "Enter a brand name of at least two characters." },
  errorPalette: { ar: "اختار لونين على الأقل.", en: "Pick at least two colors." },
  aboutTitle: { ar: "قبل الهوية… مين إحنا؟", en: "Before the identity… who are we?" },
  about: {
    ar: "رَواج وكالة تسويق رقمي في شبين الكوم، المنوفية. بنبني علامات من الصفر: هوية واضحة، خطة مبنية على أرقام، محتوى يستحق المتابعة، وحملات بتقيس كل جنيه.",
    en: "RAWAJ is a digital marketing agency in Shebin El-Kom, Menoufia. We build brands from zero: a clear identity, a numbers-driven plan, content worth following, and campaigns that measure every pound.",
  },
};

export const strategyCopy = {
  brief: {
    ar: "أي خطة تسويق ناجحة بتبدأ من الأهم للأقل. رتّب الخطوات الأربعة بالترتيب الصح.",
    en: "Every successful marketing plan starts with what matters most. Put the four steps in the right order.",
  },
  cta: { ar: "اختبر الخطة", en: "Test the plan" },
  hint: {
    ar: "لو الميزانية جت قبل الجمهور… هتصرف على حد مش موجود.",
    en: "If budget comes before audience… you're spending on someone who isn't there.",
  },
  success: {
    ar: "خطة سليمة: بنعرف مين بنكلمه، عايزين منه إيه، فين نلاقيه، وبعدين بكم.",
    en: "Solid plan: we know who we're talking to, what we want, where to find them, then how much.",
  },
  wrong: { ar: "الترتيب مش مضبوط. جرّب تاني — الجمهور دائمًا الأول.", en: "Not quite. Try again — audience always comes first." },
};

export type StrategyStepId = "audience" | "goal" | "channel" | "budget";

export const strategySteps: {
  id: StrategyStepId;
  label: Localized;
  hint: Localized;
}[] = [
  {
    id: "audience",
    label: { ar: "الجمهور المستهدف", en: "Target audience" },
    hint: {
      ar: "مين الشخص اللي بنكلمه؟ عمره، اهتماماته، ومشكلته.",
      en: "Who are we talking to? Age, interests, and problem.",
    },
  },
  {
    id: "goal",
    label: { ar: "الهدف", en: "Goal" },
    hint: {
      ar: "وعي؟ تفاعل؟ مبيعات؟ هدف واحد واضح أفضل من خمسة.",
      en: "Awareness? Engagement? Sales? One clear goal beats five.",
    },
  },
  {
    id: "channel",
    label: { ar: "القناة", en: "Channel" },
    hint: {
      ar: "فين الجمهور فعلًا؟ مش فين إحنا مرتاحين.",
      en: "Where the audience actually is — not where we're comfortable.",
    },
  },
  {
    id: "budget",
    label: { ar: "الميزانية", en: "Budget" },
    hint: {
      ar: "بعد ما نعرف الباقي، نحدد بكم نبدأ ونتوسع إمتى.",
      en: "Once the rest is clear, we decide how much to start with and when to scale.",
    },
  },
];

export const socialCopy = {
  brief: {
    ar: "رتّب أسبوع نشر لبراندك. اسحب كل نوع محتوى على يوم مناسب — لازم يكون فيه محتوى تعليمي وتفاعلي وتقديم عرض.",
    en: "Plan a publishing week for your brand. Drag each content type onto a suitable day — include educational, interactive, and an offer.",
  },
  days: [
    { ar: "الأحد", en: "Sun" },
    { ar: "الاثنين", en: "Mon" },
    { ar: "الثلاثاء", en: "Tue" },
    { ar: "الأربعاء", en: "Wed" },
    { ar: "الخميس", en: "Thu" },
    { ar: "الجمعة", en: "Fri" },
    { ar: "السبت", en: "Sat" },
  ] satisfies Localized[],
  cta: { ar: "جدول الأسبوع", en: "Schedule the week" },
  clear: { ar: "تفريغ الأسبوع", en: "Clear week" },
  engagementLabel: { ar: "تفاعل الجمهور المتوقع", en: "Expected engagement" },
  success: {
    ar: "أسبوع متوازن: تعليم يبني الثقة، تفاعل يفتح الكلام، وعرض بيحوّل الاهتمام لشراء.",
    en: "A balanced week: education builds trust, interaction opens conversation, and the offer converts interest.",
  },
  errorEmpty: {
    ar: "لسه فيه محتوى مش مجدول. كل عنصر لازم ياخد يوم.",
    en: "Some content is still unscheduled. Every item needs a day.",
  },
  errorMix: {
    ar: "الأسبوع ناقص نوع: لازم تعليمي + تفاعلي + عرض على الأقل.",
    en: "The week is missing a type: at least educational + interactive + offer.",
  },
};

export type CalendarType = "edu" | "engage" | "offer" | "story" | "launch";

export const contentItems: {
  id: string;
  label: Localized;
  type: CalendarType;
  engagement: number;
}[] = [
  {
    id: "reel-tip",
    label: { ar: "ريل: نصيحة سريعة", en: "Reel: quick tip" },
    type: "edu",
    engagement: 12,
  },
  {
    id: "story-poll",
    label: { ar: "ستوري: استطلاع", en: "Story: poll" },
    type: "engage",
    engagement: 10,
  },
  {
    id: "post-offer",
    label: { ar: "بوست: عرض محدود", en: "Post: limited offer" },
    type: "offer",
    engagement: 8,
  },
  {
    id: "reel-bts",
    label: { ar: "ريل: خلف الكواليس", en: "Reel: behind the scenes" },
    type: "story",
    engagement: 9,
  },
  {
    id: "story-launch",
    label: { ar: "ستوري: إطلاق منتج", en: "Story: product launch" },
    type: "launch",
    engagement: 11,
  },
];

export const adsCopy = {
  brief: {
    ar: "عندك 10,000 جنيه افتراضية. وزّعها على القنوات، وشوف الوصول والنقرات والمبيعات المتوقعة بتتغير لحظيًا.",
    en: "You have a virtual 10,000 EGP. Split it across channels and watch reach, clicks, and expected sales update live.",
  },
  totalLabel: { ar: "الميزانية الكلية", en: "Total budget" },
  allocated: { ar: "الموزَّع", en: "Allocated" },
  remaining: { ar: "المتبقي", en: "Remaining" },
  cta: { ar: "أطلق الحملة", en: "Launch campaign" },
  errorTotal: {
    ar: "لازم توزّع الـ 10,000 كلها قبل الإطلاق.",
    en: "You need to allocate all 10,000 before launching.",
  },
  errorSpread: {
    ar: "سيب لكل قناة 1,000 جنيه على الأقل — التنويع بيقلل المخاطرة.",
    en: "Leave at least 1,000 EGP per channel — diversification lowers risk.",
  },
  reach: { ar: "وصول", en: "Reach" },
  clicks: { ar: "نقرات", en: "Clicks" },
  sales: { ar: "مبيعات", en: "Sales" },
  disclaimer: {
    ar: "أرقام افتراضية للتعلّم — ليست نتيجة حملة حقيقية.",
    en: "Simulated numbers for learning — not real campaign results.",
  },
};

export const adsChannels = [
  {
    id: "meta" as const,
    name: { ar: "Meta", en: "Meta" },
    cpm: 45,
    ctr: 0.018,
    cvr: 0.022,
    note: { ar: "جمهور واسع + استهداف دقيق", en: "Broad reach + sharp targeting" },
    color: "#2391FF",
  },
  {
    id: "tiktok" as const,
    name: { ar: "TikTok", en: "TikTok" },
    cpm: 30,
    ctr: 0.026,
    cvr: 0.012,
    note: { ar: "وصول رخيص ونقرات أعلى", en: "Cheap reach, higher clicks" },
    color: "#FFF83F",
  },
  {
    id: "google" as const,
    name: { ar: "Google", en: "Google" },
    cpm: 70,
    ctr: 0.034,
    cvr: 0.03,
    note: { ar: "نية شراء أعلى وتحويل أقوى", en: "Higher intent, stronger conversion" },
    color: "#8F6BFF",
  },
];

export const launchCopy = {
  title: { ar: "براندك بقى على الخريطة", en: "Your brand is on the map" },
  body: {
    ar: "خلصت الحملة من الهوية للإطلاق. الأرقام دي تقديرية بناءً على قراراتك في اللعب — مش نتيجة حملة حقيقية.",
    en: "You took the brand from identity to launch. These numbers are estimates based on your in-game decisions — not a real campaign result.",
  },
  reportTitle: { ar: "تقرير براندك", en: "Your brand report" },
  strengths: { ar: "نقاط القوة", en: "Strengths" },
  recommended: { ar: "الخدمة الأنسب لك", en: "Best-fit service" },
  share: { ar: "ابعتلنا التقرير على واتساب", en: "Send us the report on WhatsApp" },
  boss: { ar: "انتقل للمرحلة الأخيرة", en: "Go to the final stage" },
  replay: { ar: "العب الحملة من جديد", en: "Replay the campaign" },
  liability: {
    ar: "كل الأرقام والنصوص هنا تعليمية وافتراضية. لا تُرسل أي بيانات عنك إلا لو اخترت أنت مشاركة التقرير.",
    en: "All numbers and text here are educational and simulated. No data about you is sent unless you choose to share the report.",
  },
};

export const strengthCopy: Record<string, Localized> = {
  identity: { ar: "هوية واضحة من أول قرار", en: "A clear identity from the first decision" },
  strategy: { ar: "تفكير استراتيجي مرتب", en: "Structured strategic thinking" },
  community: { ar: "قدرة على بناء مجتمع متفاعل", en: "Community-building instinct" },
  performance: { ar: "حس أداء واختيار قنوات", en: "Performance and channel sense" },
  budget: { ar: "توزيع ميزانية متوازن", en: "Balanced budget allocation" },
  content: { ar: "محتوى متنوع وهادف", en: "Varied, purposeful content" },
};

export const mascotLines: Record<number, Localized[]> = {
  0: [
    { ar: "الاسم واللون مش تفاصيل… دول أول انطباع.", en: "Name and color aren't details — they're the first impression." },
    { ar: "البراند اللي شكله مشتت، محدش بيثق فيه.", en: "A brand that looks scattered never earns trust." },
  ],
  1: [
    { ar: "من غير جمهور واضح، كل ميزانية بتبقى تخمين.", en: "Without a clear audience, every budget is a guess." },
    { ar: "هدف واحد واضح أحسن من خمس أهداف ضبابية.", en: "One clear goal beats five fuzzy ones." },
  ],
  2: [
    { ar: "التفاعل مش عدد لايكات… ده ناس بتتكلم معاك.", en: "Engagement isn't likes — it's people talking to you." },
    { ar: "التعليمي بيبني الثقة، والتفاعلي بيفتح الكلام.", en: "Educational builds trust; interactive opens conversation." },
  ],
  3: [
    { ar: "لو كل الفلوس في قناة واحدة، أنت بتراهن مش بتسوّق.", en: "All your money in one channel is a bet, not marketing." },
    { ar: "الوصول الرخيص مش دايمًا أرخص مبيعة.", en: "Cheap reach isn't always the cheapest sale." },
  ],
  4: [
    { ar: "غرفة العرض بتكبر كل ما أعمال موثقة تتضاف.", en: "The replay room grows as verified work is added." },
    { ar: "شاهد، اتعلم، وارجع لبناء براندك.", en: "Watch, learn, and get back to building your brand." },
  ],
  5: [
    { ar: "ورا كل حملة فريق حقيقي.", en: "Behind every campaign is a real team." },
    { ar: "البيانات هنا حقيقية — ومش هنخترع حاجة.", en: "The info here is real — we won't invent anything." },
  ],
  6: [
    { ar: "الإطلاق مش النهاية… ده أول تقرير حقيقي.", en: "Launch isn't the end — it's the first real report." },
    { ar: "الأرقام اللي شوفتها تقديرية. الحقيقية بتتحسب مع رَواج.", en: "Those numbers are estimates. Real ones are measured with RAWAJ." },
  ],
  7: [
    { ar: "وصلت للبوس ليفل. الخطوة الجاية على أرض الواقع.", en: "You reached the boss level. Next step is real life." },
    { ar: "براندك جاهز. ناقص بس الفريق اللي ينفّذ.", en: "Your brand is ready. It just needs a team to execute." },
  ],
};

export const mascotByIdle: Localized[] = [
  { ar: "قرار صغير النهاردة، نتيجة كبيرة بعد شهر.", en: "A small decision today, a big result next month." },
  { ar: "رَواج بتشتغل بالأرقام… حتى في اللعبة.", en: "RAWAJ runs on numbers — even in a game." },
  { ar: "لو وقفت، اضغط تخطي وكمّل من أي مرحلة.", en: "Stuck? Skip and continue from any stage." },
];

export const prankCopy = {
  success: {
    ar: "إعلانك جاب 10 مليون مشاهدة!",
    en: "Your ad just hit 10 million views!",
  },
  punch: {
    ar: "بهزر 😄 ده سيناريو افتراضي داخل اللعبة. النتيجة الحقيقية بتتعامل مع رَواج بأرقام موثقة.",
    en: "Kidding 😄 that's a virtual in-game scenario. Real results are built with RAWAJ, with documented numbers.",
  },
  close: { ar: "تمام، فهمت", en: "Got it" },
};

export const reportServiceReason: Record<string, Localized> = {
  "social-media": {
    ar: "تفاعل الأسبوع كان أقل من طموحك — خدمة إدارة السوشيال هتبني المجتمع اللي محتاجه.",
    en: "Your week's engagement fell short of your ambition — social media management will build the community you need.",
  },
  promotion: {
    ar: "توزيع الميزانية محتاج تحسين — خدمة الحملات الإعلانية هتقلل تكلفة النتيجة.",
    en: "Your budget split needs tuning — paid campaigns will lower your cost per result.",
  },
  "digital-marketing": {
    ar: "أساسك قوي، وناقصك خطة نمو موثقة بأرقام — دي خدمة التسويق الرقمي.",
    en: "Your foundation is solid; what's missing is a documented growth plan — that's digital marketing.",
  },
  branding: {
    ar: "هويتك بدأت، وناقصها نظام كامل — خدمة بناء الهوية هتخليها متسقة في كل نقطة تواصل.",
    en: "Your identity has started; a complete system will keep it consistent at every touchpoint.",
  },
  "content-creation": {
    ar: "المحتوى هو اللي هيخلي الناس تشوف وتفتكر — خدمة صناعة المحتوى المرئي.",
    en: "Content is what makes people watch and remember — visual content creation.",
  },
};