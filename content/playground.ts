import type { Localized } from "@/lib/i18n";

export const intro = {
  kicker: { ar: "RAWAJ CAMPAIGN", en: "RAWAJ CAMPAIGN" },
  welcome: { ar: "أهلاً بك في حملة رَواج…", en: "Welcome to the RAWAJ campaign…" },
  line: { ar: "النهاردة أنت صاحب البراند.", en: "Today, you own the brand." },
  question: { ar: "جاهز تبني براندك من الصفر؟", en: "Ready to build your brand from zero?" },
  yes: { ar: "جاهز… يلا بينا", en: "Ready — let's go" },
  unsure: { ar: "مش متأكد", en: "Not sure yet" },
  unsureReply: {
    ar: "طبيعي جدًا… أهم حاجة إنك بتحاول. هنعتبرها آه ونكمّل 😄",
    en: "Totally normal… the important thing is you tried. We'll take that as a yes 😄",
  },
  skip: { ar: "تخطي المقدمة", en: "Skip intro" },
  never: { ar: "متظهرش تاني", en: "Don't show again" },
  boot: [
    { ar: "فتح ملف البراند…", en: "Opening brand file…" },
    { ar: "تحميل خريطة الحملة…", en: "Loading campaign map…" },
    { ar: "تجهيز المراحل الثمانية…", en: "Preparing the eight stages…" },
    { ar: "جاهز! براندك في انتظارك.", en: "Ready! Your brand is waiting." },
  ],
  loadingNote: { ar: "ده تحميل حقيقي… تقريبًا.", en: "It's a real loading screen… almost." },
};

export const chatter: Localized[] = [
  { ar: "إيه يا عم بتبص ومش هتضغط؟", en: "Looking around without clicking, huh?" },
  { ar: "واضح إنك بتحب الاستكشاف!", en: "Clearly, you like exploring!" },
  { ar: "لسه مكمّل؟ طب استنى المفاجأة الجاية.", en: "Still here? Wait for the next surprise." },
  { ar: "أنت وصلت هنا إزاي أصلاً؟", en: "How did you even get here?" },
  { ar: "متقلقش، إحنا مش بنبيع كورسات!", en: "Relax, we're not selling courses!" },
  { ar: "الصفحة دي فيها مقلب… بس مش هقول فين.", en: "There's a prank on this page… but I won't say where." },
  { ar: "الزر الأصفر ده مش للزينة.", en: "That yellow button isn't decoration." },
  { ar: "لو وصلت لهنا، يبقى إنت من الناس اللي بتقرأ كل حاجة.", en: "If you got this far, you read everything. Respect." },
];

export type GameId =
  | "reaction"
  | "memory"
  | "logo"
  | "quiz"
  | "odd"
  | "spot"
  | "target"
  | "wheel"
  | "personality"
  | "wyr";

export type GameMeta = {
  id: GameId;
  title: Localized;
  desc: Localized;
  tag: Localized;
  xp: number;
};

export const games: GameMeta[] = [
  {
    id: "reaction",
    title: { ar: "اختبار سرعة الرد", en: "Reaction test" },
    desc: { ar: "استنى الإشارة… واضغط بأسرع ما يمكن. ثانية فرق = فرق.", en: "Wait for the signal… then click as fast as you can." },
    tag: { ar: "سرعة", en: "Speed" },
    xp: 35,
  },
  {
    id: "memory",
    title: { ar: "اختبار الذاكرة", en: "Memory match" },
    desc: { ar: "8 أزواج مخفية. افتكر مكان كل أيقونة قبل ما الوقت يخلص.", en: "8 hidden pairs. Remember every icon before time runs out." },
    tag: { ar: "ذاكرة", en: "Memory" },
    xp: 50,
  },
  {
    id: "logo",
    title: { ar: "خمّن الشعار", en: "Guess the logo" },
    desc: { ar: "شعارات علامات خيالية… هل تقدر تربط الشكل بالاسم؟", en: "Fictional brand marks — can you match shape to name?" },
    tag: { ar: "ملاحظة", en: "Observation" },
    xp: 40,
  },
  {
    id: "quiz",
    title: { ar: "كويز التسويق", en: "Marketing quiz" },
    desc: { ar: "5 أسئلة سريعة تفرّق بين المسوّق الحقيقي واللي بيجرّب حظه.", en: "5 quick questions to separate marketers from lucky guessers." },
    tag: { ar: "معرفة", en: "Knowledge" },
    xp: 45,
  },
  {
    id: "odd",
    title: { ar: "اختَر الغريب", en: "Odd one out" },
    desc: { ar: "4 كلمات… واحدة مش زي الباقي. بسيطة؟ جرّب.", en: "4 words, one doesn't belong. Simple? Try it." },
    tag: { ar: "تفكير", en: "Thinking" },
    xp: 30,
  },
  {
    id: "spot",
    title: { ar: "اكتشف الفرق", en: "Spot the difference" },
    desc: { ar: "شبكتان متطابقتان ظاهريًا… 3 اختلافات فقط.", en: "Two identical-looking grids… exactly 3 differences." },
    tag: { ar: "تركيز", en: "Focus" },
    xp: 40,
  },
  {
    id: "target",
    title: { ar: "اضرب الهدف", en: "Hit the target" },
    desc: { ar: "15 ثانية، أهداف تظهر وتختفي. كل ضغطة دقيقة = نقطة.", en: "15 seconds. Targets appear and vanish. Every hit counts." },
    tag: { ar: "دقة", en: "Accuracy" },
    xp: 40,
  },
  {
    id: "wheel",
    title: { ar: "عجلة الحظ", en: "Wheel of luck" },
    desc: { ar: "لف العجلة واعرف جائزتك… النتيجة غير قابلة للاستئناف 😅", en: "Spin and win… no appeals accepted 😅" },
    tag: { ar: "حظ", en: "Luck" },
    xp: 30,
  },
  {
    id: "personality",
    title: { ar: "اختبار الشخصية", en: "Personality test" },
    desc: { ar: "4 أسئلة تكشف شخصيتك داخل فريق تسويق.", en: "4 questions reveal your marketing team persona." },
    tag: { ar: "شخصية", en: "Persona" },
    xp: 45,
  },
  {
    id: "wyr",
    title: { ar: "Would You Rather", en: "Would you rather" },
    desc: { ar: "اختيارات صعبة… ومضحكة… ومن غير إجابة صح.", en: "Hard choices… funny ones… with no right answer." },
    tag: { ar: "رأي", en: "Opinion" },
    xp: 25,
  },
];

export const traps = [
  {
    id: "personality-trap",
    title: { ar: "اختبار الشخصية", en: "The personality test" },
    hook: { ar: "هنكتشف شخصيتك في 10 ثواني!", en: "We'll reveal your personality in 10 seconds!" },
    cta: { ar: "يلا نبدأ", en: "Let's start" },
    xp: 20,
    tone: "blue" as const,
  },
  {
    id: "luck-trap",
    title: { ar: "اختبار الحظ", en: "The luck test" },
    hook: { ar: "اضغط واكسب مليون جنيه", en: "Click to win a million" },
    cta: { ar: "اضغط واكسب", en: "Click and win" },
    xp: 20,
    tone: "yellow" as const,
  },
  {
    id: "robot-trap",
    title: { ar: "هل أنت إنسان أم روبوت؟", en: "Human or robot?" },
    hook: { ar: "تحقق سريع… لن يمر منه أحد.", en: "A quick check… nobody passes." },
    cta: { ar: "ابدأ التحقق", en: "Start check" },
    xp: 20,
    tone: "blue" as const,
  },
  {
    id: "danger-trap",
    title: { ar: "زر خطير", en: "A dangerous button" },
    hook: { ar: "ممنوع الضغط هنا. بجد.", en: "Do not press this. Seriously." },
    cta: { ar: "مش هضغط… هضغط", en: "I won't… I will" },
    xp: 20,
    tone: "yellow" as const,
  },
];

export const trapCopy = {
  personality: {
    questions: [
      {
        q: { ar: "لما تشوف إعلان ناجح بتفكر إزاي؟", en: "When you see a great ad, you think…" },
        options: [
          { ar: "مين الجمهور المستهدف؟", en: "Who's the target audience?" },
          { ar: "التصميم ده إزاي اتعمل؟", en: "How was this designed?" },
          { ar: "كام تكلفة الوصول دي؟", en: "What's the cost per reach?" },
        ],
      },
      {
        q: { ar: "بتحب تكون قائد الفريق ولا اللي بيعمل كل حاجة؟", en: "Leader of the team or the one doing everything?" },
        options: [
          { ar: "قائد… بس بسمع", en: "Leader… but I listen" },
          { ar: "أنا بعمل كل حاجة", en: "I do everything" },
          { ar: "أنا اللي بيحل المشاكل", en: "I'm the problem solver" },
        ],
      },
      {
        q: { ar: "لو صفحتك جابت مليون مشاهدة هتعمل إيه؟", en: "If your page hit a million views, you'd…" },
        options: [
          { ar: "أحلل الأرقام فورًا", en: "Analyze the numbers" },
          { ar: "أعمل محتوى تاني بنفس الوصفة", en: "Recreate the same magic" },
          { ar: "أصوّر ريلز أعلن فيه", en: "Film a celebration reel" },
        ],
      },
    ],
    loading: [
      { ar: "جاري تحليل شخصيتك…", en: "Analyzing your personality…" },
      { ar: "جاري اختراق ملفاتك النفسية…", en: "Hacking your psychological files…" },
      { ar: "تم اكتشاف أنك شخص خطير جدًا!", en: "Detected: dangerously talented!" },
    ],
    reveal: { ar: "مبروك! أنت اتهكرت 😂", en: "Congrats! You've been hacked 😂" },
    after: {
      ar: "بهزر معاك يا نجم، إحنا في رَواج بنحب نهزر! مفيش أي اختراق ولا وصول لأي بيانات — دي مجرد مزحة رقمية.",
      en: "Kidding, superstar — at RAWAJ we love to joke! Nothing was hacked and no data was accessed. It's just a digital prank.",
    },
  },
  robot: {
    questions: [
      {
        q: { ar: "لو شربت قهوة باردة، بتعمل إيه؟", en: "Cold coffee. What do you do?" },
        options: [
          { ar: "أشربها وأنا باصص في الشاشة", en: "Drink it while staring at the screen" },
          { ar: "أسخنها تاني", en: "Reheat it" },
          { ar: "أطلب واحدة تانية وأكمّل شغل", en: "Order another and keep working" },
        ],
      },
      {
        q: { ar: "بتفتح السوشيال ميديا أول حاجة الصبح؟", en: "First thing in the morning, you open social?" },
        options: [
          { ar: "طبعًا، ده بحث سوق", en: "Obviously. It's market research" },
          { ar: "بعد القهوة بس", en: "Only after coffee" },
          { ar: "أنا صاحي أصلاً من امبارح", en: "I never slept" },
        ],
      },
      {
        q: { ar: "لما الكلاينت يقول «خليها تبقى فيرال»؟", en: "Client says: “make it go viral”?" },
        options: [
          { ar: "أبتسم وأقول حاضر", en: "Smile and say sure" },
          { ar: "أشرح إن الفيرال مش خطة", en: "Explain virality isn't a plan" },
          { ar: "أعمل 3 نسخ وأجرّب", en: "Make 3 versions and test" },
        ],
      },
      {
        q: { ar: "اختَر اللون اللي يوصفك:", en: "Pick the color that describes you:" },
        options: [
          { ar: "أزرق رَواج", en: "RAWAJ blue" },
          { ar: "أصفر رَواج", en: "RAWAJ yellow" },
          { ar: "رمادي بتاع التسليمات", en: "Deadline gray" },
        ],
      },
    ],
    result: {
      ar: "النتيجة: إنسان طبيعي بنسبة 2%… والباقي محتاج صيانة!",
      en: "Result: 2% certified human… the rest needs maintenance!",
    },
    after: {
      ar: "الاختبار ده هزار بالكامل. مفيش تحليل حقيقي ولا بيانات بتتسجّل — إحنا بس بنحب نضحك معاك.",
      en: "This test is 100% comedy. No real analysis, no data saved — we just like laughing with you.",
    },
  },
  luck: {
    button: { ar: "اضغط واكسب مليون جنيه", en: "Click to win a million" },
    spinning: { ar: "بندور… بندور…", en: "Spinning… spinning…" },
    segments: [
      { ar: "مليون جنيه", en: "1,000,000" },
      { ar: "كنت قريب", en: "So close" },
      { ar: "الإنترنت فصل", en: "Connection lost" },
      { ar: "حبشتكنوت", en: "Nothing" },
      { ar: "خصم 0%", en: "0% off" },
      { ar: "برافو عليك", en: "Well done" },
      { ar: "حظ أوفر", en: "Better luck" },
      { ar: "مليون… مشاهدة", en: "1M… views" },
    ],
    results: [
      { ar: "كنت قريب جدًا… بس الإنترنت فصل! 😅", en: "You were so close… but the internet dropped! 😅" },
      { ar: "مبروك! كسبت مليون… مشاهدة على فيديو حد تاني.", en: "Congrats! You won a million… views on someone else's video." },
      { ar: "الجايزة الكبرى طلعت «خصم 0%». شكرًا لمشاركتك.", en: "The grand prize turned out to be “0% off.” Thanks for playing." },
    ],
    after: {
      ar: "ولا مليون ولا حاجة — دي عجلة هزار بس. الجايزة الحقيقية إنك وصلت لهنا.",
      en: "No million, nothing — just a joke wheel. The real prize is that you made it here.",
    },
  },
  danger: {
    label: { ar: "ممنوع الضغط هنا", en: "Do not press here" },
    steps: [
      { ar: "قلتلك ممنوع… ضغطت ليه؟", en: "I said don't… why did you press?" },
      { ar: "خلاص، بدأنا. متتحركش.", en: "Fine, it's started. Don't move." },
      { ar: "جاري تحميل عواقب… 37%", en: "Loading consequences… 37%" },
      { ar: "مفاجأة: مفيش عواقب. إحنا طيبين.", en: "Surprise: no consequences. We're nice." },
      { ar: "بس إنت رسميًا فضولي من الدرجة الأولى.", en: "But you're officially a first-class curious cat." },
    ],
    final: {
      ar: "أهلاً بيك في رَواج! المكان اللي بنحب فيه الشغل الجاد… بجد. تقدر ترجع لأعمالنا من غير ما تضغط أزرار خطيرة.",
      en: "Welcome to RAWAJ! We love serious work… seriously. Head back to our work without pressing dangerous buttons.",
    },
  },
};

export const marketingQuiz = [
  {
    q: { ar: "أهم مؤشر لنجاح حملة إعلانية؟", en: "The key metric for ad campaign success?" },
    options: [
      { ar: "عدد الإعجابات", en: "Likes" },
      { ar: "العائد على الإنفاق (ROAS)", en: "Return on ad spend (ROAS)" },
      { ar: "عدد المتابعين", en: "Follower count" },
      { ar: "لون التصميم", en: "Design color" },
    ],
    answer: 1,
    explain: {
      ar: "الإعجابات لطيفة، لكن ROAS هو اللي يقولك الإعلان رجّع فلوس ولا لأ.",
      en: "Likes are nice, but ROAS tells you whether the ad actually returned money.",
    },
  },
  {
    q: { ar: "أول خطوة قبل أي حملة؟", en: "First step before any campaign?" },
    options: [
      { ar: "نشر كل يوم", en: "Post daily" },
      { ar: "تحديد الجمهور والهدف", en: "Define audience and goal" },
      { ar: "شراء متابعين", en: "Buy followers" },
      { ar: "تغيير اللوجو", en: "Change the logo" },
    ],
    answer: 1,
    explain: {
      ar: "بدون جمهور واضح وهدف محدد، أي إنفاق إعلاني بيكون تخمين.",
      en: "Without a clear audience and goal, any ad spend is a guess.",
    },
  },
  {
    q: { ar: "إيه أفضل تعريف للـ Content Pillars؟", en: "Best definition of content pillars?" },
    options: [
      { ar: "أعمدة في التصميم", en: "Columns in a design" },
      { ar: "أنواع محتوى أساسية متكررة", en: "Core recurring content themes" },
      { ar: "هاشتاجات الماركة", en: "Brand hashtags" },
      { ar: "عدد المنشورات اليومية", en: "Daily post count" },
    ],
    answer: 1,
    explain: {
      ar: "المحتوى القوي بيتوزع على أعمدة ثابتة: تعليمي، ترفيهي، قصص، وعروض.",
      en: "Strong content balances fixed pillars: educational, entertaining, stories, and offers.",
    },
  },
  {
    q: { ar: "متى تعمل A/B Test؟", en: "When do you run an A/B test?" },
    options: [
      { ar: "لما تكون عايز تعرف الأنسب من نسختين", en: "To know which of two versions performs better" },
      { ar: "لما الميزانية تخلص", en: "When the budget runs out" },
      { ar: "كل يوم بدون سبب", en: "Every day for no reason" },
      { ar: "بعد إغلاق المشروع", en: "After the project closes" },
    ],
    answer: 0,
    explain: {
      ar: "A/B Test أداة للمقارنة العادلة، مش نشاط عشوائي.",
      en: "A/B testing is for fair comparison, not random activity.",
    },
  },
  {
    q: { ar: "أفضل مقياس لصحة المحتوى؟", en: "Best signal of content health?" },
    options: [
      { ar: "الحفظ والمشاركة", en: "Saves and shares" },
      { ar: "عدد التعليقات السلبية", en: "Negative comments" },
      { ar: "طول الفيديو", en: "Video length" },
      { ar: "عدد الفلاتر", en: "Number of filters" },
    ],
    answer: 0,
    explain: {
      ar: "الحفظ والمشاركة أقوى مؤشرات على قيمة المحتوى وتأثيره.",
      en: "Saves and shares are the strongest signals of content value.",
    },
  },
];

export const oddRounds = [
  {
    words: { ar: ["ريلز", "ستوري", "بوست", "فاتورة"], en: ["Reel", "Story", "Post", "Invoice"] },
    answer: 3,
    explain: { ar: "فاتورة مش نوع محتوى… لحد الآن.", en: "An invoice isn't a content type… yet." },
  },
  {
    words: { ar: ["هوية", "شعار", "ألوان", "خط"], en: ["Identity", "Logo", "Colors", "Font"] },
    answer: 0,
    explain: { ar: "الهوية هي النظام الكامل؛ الباقي مكونات داخله.", en: "Identity is the whole system; the rest are its parts." },
  },
  {
    words: { ar: ["CTR", "CPC", "ROAS", "CEO"], en: ["CTR", "CPC", "ROAS", "CEO"] },
    answer: 3,
    explain: { ar: "CEO مدير تنفيذي، مش مؤشر إعلاني.", en: "A CEO is an executive, not an ad metric." },
  },
  {
    words: { ar: ["محتوى", "تصوير", "مونتاج", "محاسبة"], en: ["Content", "Shoot", "Editing", "Accounting"] },
    answer: 3,
    explain: { ar: "المحاسبة مهمة… بس مش في استوديو المحتوى.", en: "Accounting matters… just not in the content studio." },
  },
  {
    words: { ar: ["جمهور", "سوق", "منافس", "سيلفي"], en: ["Audience", "Market", "Competitor", "Selfie"] },
    answer: 3,
    explain: { ar: "السيلفي مش تحليل سوق… غالبًا.", en: "A selfie isn't market analysis… usually." },
  },
];

export const logoRounds = [
  {
    brand: { ar: "نوفا", en: "Nova" },
    shape: "star" as const,
    color: "#2391FF",
    accent: "#FFF83F",
    options: { ar: ["نوفا", "ميرا", "أوربت", "لومي"], en: ["Nova", "Mira", "Orbit", "Lumi"] },
    answer: 0,
  },
  {
    brand: { ar: "مدار", en: "Madar" },
    shape: "orbit" as const,
    color: "#FFF83F",
    accent: "#040B14",
    options: { ar: ["مدار", "نبض", "أفق", "دار"], en: ["Madar", "Nabd", "Ofoq", "Dar"] },
    answer: 0,
  },
  {
    brand: { ar: "قمة", en: "Qimma" },
    shape: "triangle" as const,
    color: "#7CC6FF",
    accent: "#040B14",
    options: { ar: ["رواق", "قمة", "مدى", "سحاب"], en: ["Rewaq", "Qimma", "Mada", "Sahab"] },
    answer: 1,
  },
  {
    brand: { ar: "شرارة", en: "Sharara" },
    shape: "bolt" as const,
    color: "#FFF83F",
    accent: "#2391FF",
    options: { ar: ["شرارة", "وهج", "صدى", "مينا"], en: ["Sharara", "Wahaj", "Sada", "Mina"] },
    answer: 0,
  },
];

export type PersonaKey = "strategist" | "maker" | "hype" | "calm";

export const personalityGame = {
  questions: [
    {
      q: { ar: "أول حاجة بتعملها في مشروع جديد؟", en: "First thing on a new project?" },
      options: [
        { ar: "أرسم خطة كاملة", en: "Draw the full plan", key: "strategist" as PersonaKey },
        { ar: "أبدأ أعمل نسخة تجريبية", en: "Build a quick prototype", key: "maker" as PersonaKey },
        { ar: "أتكلم مع الجمهور فورًا", en: "Talk to the audience immediately", key: "hype" as PersonaKey },
        { ar: "أقرأ كل حاجة بهدوء", en: "Read everything calmly", key: "calm" as PersonaKey },
      ],
    },
    {
      q: { ar: "لما الديدلاين يقرب؟", en: "When the deadline approaches?" },
      options: [
        { ar: "أرتب الأولويات", en: "Re-prioritize", key: "strategist" as PersonaKey },
        { ar: "أشتغل بسرعة وأخلّص", en: "Sprint and finish", key: "maker" as PersonaKey },
        { ar: "أحمّس الفريق", en: "Pump up the team", key: "hype" as PersonaKey },
        { ar: "أفضل هادي وأركّز", en: "Stay calm and focus", key: "calm" as PersonaKey },
      ],
    },
    {
      q: { ar: "نجاح كبير حصل… رد فعلك؟", en: "Big win happens… your reaction?" },
      options: [
        { ar: "أحلّل سبب النجاح", en: "Analyze why it worked", key: "strategist" as PersonaKey },
        { ar: "أبدأ الشغل اللي بعده", en: "Start the next thing", key: "maker" as PersonaKey },
        { ar: "أحتفل وأشارك الفريق", en: "Celebrate with the team", key: "hype" as PersonaKey },
        { ar: "أبتسم من جوه", en: "Smile quietly", key: "calm" as PersonaKey },
      ],
    },
    {
      q: { ar: "إيه اللي يزعّلك في الشغل؟", en: "What frustrates you at work?" },
      options: [
        { ar: "خطة بدون هدف", en: "A plan without a goal", key: "strategist" as PersonaKey },
        { ar: "كلام كتير بدون تنفيذ", en: "Talk without execution", key: "maker" as PersonaKey },
        { ar: "روح فريق ميتة", en: "Zero team energy", key: "hype" as PersonaKey },
        { ar: "ضجة بدون داعي", en: "Unnecessary noise", key: "calm" as PersonaKey },
      ],
    },
  ],
  results: {
    strategist: {
      title: { ar: "العقل الاستراتيجي", en: "The Strategist" },
      desc: {
        ar: "أنت اللي بيشوف الصورة الكبيرة قبل ما حد يفتح الصورة. بتحب الخطط والأرقام والهدف الواضح.",
        en: "You see the big picture before anyone opens it. You love plans, numbers, and a clear goal.",
      },
    },
    maker: {
      title: { ar: "صانع التنفيذ", en: "The Maker" },
      desc: {
        ar: "أفكارك مش بتقعد في درج. بتحب تعمل وتجرّب وتشوف النتيجة على الأرض.",
        en: "Your ideas don't sit in a drawer. You build, test, and see real results.",
      },
    },
    hype: {
      title: { ar: "مولّد الطاقة", en: "The Hype Machine" },
      desc: {
        ar: "وجودك بيغيّر جو الغرفة. بتعرف تحكي القصة وتخلي الناس تتحمس للفكرة.",
        en: "You change the room's energy. You tell the story and make people care.",
      },
    },
    calm: {
      title: { ar: "المرساة الهادية", en: "The Calm Anchor" },
      desc: {
        ar: "وسط أي ضجة، إنت اللي بيفضل مركّز. تفاصيلك دقيقة وهدوءك معدٍ.",
        en: "Amid any chaos, you stay focused. Your details are sharp and your calm is contagious.",
      },
    },
  } as Record<PersonaKey, { title: Localized; desc: Localized }>,
};

export const wyrRounds = [
  {
    left: { ar: "حملة ناجحة بس بدون بيانات", en: "A winning campaign with zero data" },
    right: { ar: "حملة عادية ببيانات كاملة", en: "An average campaign with full data" },
    commentLeft: { ar: "جسور… بس إحنا بنحب الأرقام.", en: "Bold… but we love numbers." },
    commentRight: { ar: "اختيار المحترفين بصراحة.", en: "The pro choice, honestly." },
  },
  {
    left: { ar: "كلاينت بيوافق على كل حاجة", en: "A client who approves everything" },
    right: { ar: "كلاينت بيسأل أسئلة صعبة", en: "A client who asks hard questions" },
    commentLeft: { ar: "مريح… لحد أول أزمة.", en: "Comfortable… until the first crisis." },
    commentRight: { ar: "الأسئلة الصعبة بتصنع شغل أحسن.", en: "Hard questions make better work." },
  },
  {
    left: { ar: "فيديو فيرال بالمصادفة", en: "An accidental viral video" },
    right: { ar: "نمو ثابت كل شهر", en: "Steady growth every month" },
    commentLeft: { ar: "حلو… لكن المصادفة مش خطة.", en: "Nice… but luck isn't a plan." },
    commentRight: { ar: "النمو الثابت هو اللي بيدوم.", en: "Steady growth is what lasts." },
  },
  {
    left: { ar: "شغل من البيت للأبد", en: "Remote forever" },
    right: { ar: "شغل من الاستوديو مع الفريق", en: "Studio work with the team" },
    commentLeft: { ar: "مرونة ممتازة… بس القهوة؟", en: "Great flexibility… but the coffee?" },
    commentRight: { ar: "الطاقة بتاعت الفريق ملهاش بديل.", en: "Team energy has no substitute." },
  },
  {
    left: { ar: "تصميم جميل بدون هدف", en: "Beautiful design with no goal" },
    right: { ar: "تصميم بسيط بيبيع", en: "Simple design that sells" },
    commentLeft: { ar: "متحف مش حملة.", en: "That's a museum, not a campaign." },
    commentRight: { ar: "الجمال اللي بيبيع هو الأجمل.", en: "Beauty that sells is the most beautiful." },
  },
];

export const wheelSegments = [
  { ar: "نصيحة مجانية", en: "Free advice" },
  { ar: "قهوة على حسابنا", en: "Coffee on us" },
  { ar: "ميم مخصص", en: "Custom meme" },
  { ar: "حظ أوفر", en: "Try again" },
  { ar: "خصم 0%", en: "0% off" },
  { ar: "تصفيقة", en: "A round of applause" },
  { ar: "مقلب تاني", en: "Another prank" },
  { ar: "احترام", en: "Pure respect" },
];