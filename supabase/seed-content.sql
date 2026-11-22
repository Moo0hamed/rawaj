-- RAWAJ Content Seed SQL
-- Run this in Supabase SQL Editor after migrations (001, 002, 003)
-- Idempotent: uses ON CONFLICT DO NOTHING / DO UPDATE where appropriate.

-- =====================
-- SITE SETTINGS (single row id=1)
-- =====================
insert into public.site_settings (id, data)
values (1, '{
  "name": "RAWAJ",
  "tagline": { "ar": "موقعك هو اللعبة", "en": "the site is the game" },
  "description": { "ar": "وكالة تسويق رقمي في شبين الكوم، المنوفية. بنبني علامات من الصفر.", "en": "Digital marketing agency in Shebin El-Kom, Menoufia. We build brands from zero." },
  "url": "https://rawaj.agency",
  "phone": "01024345291",
  "whatsapp": "01024345291",
  "email": "123ONETWO123123@GMAIL.COM",
  "address": { "ar": "شبين الكوم، المنوفية، مصر", "en": "Shebin El-Kom, Menoufia, Egypt" },
  "workingHours": { "ar": "الأحد–الخميس 9ص–5م", "en": "Sun–Thu 9am–5pm" },
  "social": {
    "instagram": "https://instagram.com/rawaj.agency",
    "facebook": "https://facebook.com/rawaj.agency",
    "linkedin": "https://linkedin.com/company/rawaj-agency",
    "behance": "https://behance.net/rawaj"
  },
  "legalName": "RAWAJ Digital Marketing Agency",
  "toggles": { "maintenance": false, "horrorEnabled": true, "pranksEnabled": true },
  "texts": {}
}'::jsonb)
on conflict (id) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Stages (campaign stages)
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('stage', 'identity', 0, true, true, '{"id":"identity","code":"STAGE 01","title":{"ar":"الهوية","en":"Identity"},"tagline":{"ar":"اسم براندك وألوانه من لوحة رَواج، وأول تعريف بعلامتك.","en":"Your brand name, RAWAJ-palette colors, and your first brand definition."},"serviceSlug":"branding","xp":20,"coins":3}'::jsonb),
  ('stage', 'strategy', 1, true, true, '{"id":"strategy","code":"STAGE 02","title":{"ar":"الاستراتيجية","en":"Strategy"},"tagline":{"ar":"رتّب خطة التسويق: الجمهور، الهدف، القناة، الميزانية.","en":"Sequence the plan: audience, goal, channel, budget."},"serviceSlug":"digital-marketing","xp":20,"coins":3}'::jsonb),
  ('stage', 'social', 2, true, true, '{"id":"social","code":"STAGE 03","title":{"ar":"المحتوى والسوشيال","en":"Content & Social"},"tagline":{"ar":"ابنِ تقويم نشر أسبوعي يرفع تفاعل الجمهور.","en":"Build a weekly content calendar that lifts engagement."},"serviceSlug":"social-media","xp":20,"coins":3}'::jsonb),
  ('stage', 'ads', 3, true, true, '{"id":"ads","code":"STAGE 04","title":{"ar":"الإعلانات","en":"Ads"},"tagline":{"ar":"وزّع ميزانية افتراضية وشاهد وصولًا ونقرات ومبيعات تقديرية.","en":"Allocate a virtual budget and watch estimated reach, clicks, and sales."},"serviceSlug":"promotion","xp":20,"coins":3}'::jsonb),
  ('stage', 'replay', 4, true, true, '{"id":"replay","code":"STAGE 05","title":{"ar":"غرفة العرض","en":"Replay Room"},"tagline":{"ar":"شاهد أعمال رَواج الموثقة عندما تتوفر.","en":"Watch verified RAWAJ work when it becomes available."},"serviceSlug":"content-creation","xp":50,"coins":0}'::jsonb),
  ('stage', 'team', 5, true, true, '{"id":"team","code":"STAGE 06","title":{"ar":"الفريق","en":"The Team"},"tagline":{"ar":"تعرّف على الفريق الحقيقي خلف رَواج.","en":"Meet the real team behind RAWAJ."},"xp":10,"coins":0}'::jsonb),
  ('stage', 'launch', 6, true, true, '{"id":"launch","code":"STAGE 07","title":{"ar":"الإطلاق","en":"Launch"},"tagline":{"ar":"لحظة النجاح وتقرير براند شخصي مبني على قراراتك.","en":"The win moment and a personal brand report built from your choices."},"xp":40,"coins":5}'::jsonb),
  ('stage', 'boss', 7, true, true, '{"id":"boss","code":"BOSS LEVEL","title":{"ar":"ابدأ مشروعك الحقيقي","en":"Start your real project"},"tagline":{"ar":"براندك جاهز. تواصل مع رَواج وابدأ التنفيذ.","en":"Your brand is ready. Contact RAWAJ and start executing."},"xp":30,"coins":0}'::jsonb)
on conflict (kind, slug) do update set
  sort_order = excluded.sort_order,
  published = excluded.published,
  visible = excluded.visible,
  data = excluded.data,
  updated_at = now();

-- =====================
-- CONTENT ITEMS: Palette colors
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('palette', 'rawaj-blue', 0, true, true, '{"hex":"#2391FF","name":{"ar":"أزرق رَواج","en":"RAWAJ blue"}}'::jsonb),
  ('palette', 'rawaj-yellow', 1, true, true, '{"hex":"#FFF83F","name":{"ar":"أصفر رَواج","en":"RAWAJ yellow"}}'::jsonb),
  ('palette', 'ice-white', 2, true, true, '{"hex":"#E9F1FF","name":{"ar":"أبيض ثلجي","en":"Ice white"}}'::jsonb),
  ('palette', 'deep-night', 3, true, true, '{"hex":"#040B14","name":{"ar":"ليل عميق","en":"Deep night"}}'::jsonb)
on conflict (kind, slug) do update set
  data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Strategy steps
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('strategy_step', 'audience', 0, true, true, '{"id":"audience","label":{"ar":"الجمهور المستهدف","en":"Target audience"},"hint":{"ar":"مين الشخص اللي بنكلمه؟ عمره، اهتماماته، ومشكلته.","en":"Who are we talking to? Age, interests, and problem."}}'::jsonb),
  ('strategy_step', 'goal', 1, true, true, '{"id":"goal","label":{"ar":"الهدف","en":"Goal"},"hint":{"ar":"وعي؟ تفاعل؟ مبيعات؟ هدف واحد واضح أفضل من خمسة.","en":"Awareness? Engagement? Sales? One clear goal beats five."}}'::jsonb),
  ('strategy_step', 'channel', 2, true, true, '{"id":"channel","label":{"ar":"القناة","en":"Channel"},"hint":{"ar":"فين الجمهور فعلًا؟ مش فين إحنا مرتاحين.","en":"Where the audience actually is — not where we are comfortable."}}'::jsonb),
  ('strategy_step', 'budget', 3, true, true, '{"id":"budget","label":{"ar":"الميزانية","en":"Budget"},"hint":{"ar":"بعد ما نعرف الباقي، نحدد بكم نبدأ ونتوسع إمتى.","en":"Once the rest is clear, we decide how much to start with and when to scale."}}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Social content items (calendar types)
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('social_content', 'reel-tip', 0, true, true, '{"id":"reel-tip","label":{"ar":"ريل: نصيحة سريعة","en":"Reel: quick tip"},"type":"edu","engagement":12}'::jsonb),
  ('social_content', 'story-poll', 1, true, true, '{"id":"story-poll","label":{"ar":"ستوري: استطلاع","en":"Story: poll"},"type":"engage","engagement":10}'::jsonb),
  ('social_content', 'post-offer', 2, true, true, '{"id":"post-offer","label":{"ar":"بوست: عرض محدود","en":"Post: limited offer"},"type":"offer","engagement":8}'::jsonb),
  ('social_content', 'reel-bts', 3, true, true, '{"id":"reel-bts","label":{"ar":"ريل: خلف الكواليس","en":"Reel: behind the scenes"},"type":"story","engagement":9}'::jsonb),
  ('social_content', 'story-launch', 4, true, true, '{"id":"story-launch","label":{"ar":"ستوري: إطلاق منتج","en":"Story: product launch"},"type":"launch","engagement":11}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Ads channels
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('ads_channel', 'meta', 0, true, true, '{"id":"meta","name":{"ar":"Meta","en":"Meta"},"cpm":45,"ctr":0.018,"cvr":0.022,"note":{"ar":"جمهور واسع + استهداف دقيق","en":"Broad reach + sharp targeting"},"color":"#2391FF"}'::jsonb),
  ('ads_channel', 'tiktok', 1, true, true, '{"id":"tiktok","name":{"ar":"TikTok","en":"TikTok"},"cpm":30,"ctr":0.026,"cvr":0.012,"note":{"ar":"وصول رخيص ونقرات أعلى","en":"Cheap reach, higher clicks"},"color":"#FFF83F"}'::jsonb),
  ('ads_channel', 'google', 2, true, true, '{"id":"google","name":{"ar":"Google","en":"Google"},"cpm":70,"ctr":0.034,"cvr":0.03,"note":{"ar":"نية شراء أعلى وتحويل أقوى","en":"Higher intent, stronger conversion"},"color":"#8F6BFF"}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Mascot lines (per stage + idle)
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('mascot_lines', 'stage-0', 0, true, true, '{"lines":[{"ar":"الاسم واللون مش تفاصيل… دول أول انطباع.","en":"Name and color aren\\u0027t details — they\\u0027re the first impression."},{"ar":"البراند اللي شكله مشتت، محدش بيثق فيه.","en":"A brand that looks scattered never earns trust."}]}'::jsonb),
  ('mascot_lines', 'stage-1', 1, true, true, '{"lines":[{"ar":"من غير جمهور واضح، كل ميزانية بتبقى تخمين.","en":"Without a clear audience, every budget is a guess."},{"ar":"هدف واحد واضح أحسن من خمس أهداف ضبابية.","en":"One clear goal beats five fuzzy ones."}]}'::jsonb),
  ('mascot_lines', 'stage-2', 2, true, true, '{"lines":[{"ar":"التفاعل مش عدد لايكات… ده ناس بتتكلم معاك.","en":"Engagement isn\\u0027t likes — it\\u0027s people talking to you."},{"ar":"التعليمي بيبني الثقة، والتفاعلي بيفتح الكلام.","en":"Educational builds trust; interactive opens conversation."}]}'::jsonb),
  ('mascot_lines', 'stage-3', 3, true, true, '{"lines":[{"ar":"لو كل الفلوس في قناة واحدة، أنت بتراهن مش بتسوّق.","en":"All your money in one channel is a bet, not marketing."},{"ar":"الوصول الرخيص مش دايمًا أرخص مبيعة.","en":"Cheap reach isn\\u0027t always the cheapest sale."}]}'::jsonb),
  ('mascot_lines', 'stage-4', 4, true, true, '{"lines":[{"ar":"غرفة العرض بتكبر كل ما أعمال موثقة تتضاف.","en":"The replay room grows as verified work is added."},{"ar":"شاهد، اتعلم، وارجع لبناء براندك.","en":"Watch, learn, and get back to building your brand."}]}'::jsonb),
  ('mascot_lines', 'stage-5', 5, true, true, '{"lines":[{"ar":"ورا كل حملة فريق حقيقي.","en":"Behind every campaign is a real team."},{"ar":"البيانات هنا حقيقية — ومش هنخترع حاجة.","en":"The info here is real — we won\\u0027t invent anything."}]}'::jsonb),
  ('mascot_lines', 'stage-6', 6, true, true, '{"lines":[{"ar":"الإطلاق مش النهاية… ده أول تقرير حقيقي.","en":"Launch isn\\u0027t the end — it\\u0027s the first real report."},{"ar":"الأرقام اللي شوفتها تقديرية. الحقيقية بتتحسب مع رَواج.","en":"Those numbers are estimates. Real ones are measured with RAWAJ."}]}'::jsonb),
  ('mascot_lines', 'stage-7', 7, true, true, '{"lines":[{"ar":"وصلت للبوس ليفل. الخطوة الجاية على أرض الواقع.","en":"You reached the boss level. Next step is real life."},{"ar":"براندك جاهز. ناقص بس الفريق اللي ينفّذ.","en":"Your brand is ready. It just needs a team to execute."}]}'::jsonb),
  ('mascot_lines', 'idle', 8, true, true, '{"lines":[{"ar":"قرار صغير النهاردة، نتيجة كبيرة بعد شهر.","en":"A small decision today, a big result next month."},{"ar":"رَواج بتشتغل بالأرقام… حتى في اللعبة.","en":"RAWAJ runs on numbers — even in a game."},{"ar":"لو وقفت، اضغط تخطي وكمّل من أي مرحلة.","en":"Stuck? Skip and continue from any stage."}]}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Identity copy
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('copy', 'identity', 0, true, true, '{"ask":{"ar":"اسم براندك إيه؟","en":"What\\u0027s your brand name?"},"placeholder":{"ar":"مثال: نُقطة","en":"e.g. Noqta"},"paletteLabel":{"ar":"اختار لغاية 3 ألوان من هوية رَواج","en":"Pick up to 3 colors from RAWAJ\\u0027s identity"},"preview":{"ar":"معاينة بطاقة البراند","en":"Brand card preview"},"cta":{"ar":"اعتمد الهوية","en":"Lock the identity"},"errorName":{"ar":"اكتب اسم براند من حرفين على الأقل.","en":"Enter a brand name of at least two characters."},"errorPalette":{"ar":"اختار لونين على الأقل.","en":"Pick at least two colors."},"aboutTitle":{"ar":"قبل الهوية… مين إحنا؟","en":"Before the identity… who are we?"},"about":{"ar":"رَواج وكالة تسويق رقمي في شبين الكوم، المنوفية. بنبني علامات من الصفر: هوية واضحة، خطة مبنية على أرقام، محتوى يستحق المتابعة، وحملات بتقيس كل جنيه.","en":"RAWAJ is a digital marketing agency in Shebin El-Kom, Menoufia. We build brands from zero: a clear identity, a numbers-driven plan, content worth following, and campaigns that measure every pound."}}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Strategy copy
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('copy', 'strategy', 1, true, true, '{"brief":{"ar":"أي خطة تسويق ناجحة بتبدأ من الأهم للأقل. رتّب الخطوات الأربعة بالترتيب الصح.","en":"Every successful marketing plan starts with what matters most. Put the four steps in the right order."},"cta":{"ar":"اختبر الخطة","en":"Test the plan"},"hint":{"ar":"لو الميزانية جت قبل الجمهور… هتصرف على حد مش موجود.","en":"If budget comes before audience… you\\u0027re spending on someone who isn\\u0027t there."},"success":{"ar":"خطة سليمة: بنعرف مين بنكلمه، عايزين منه إيه، فين نلاقيه، وبعدين بكم.","en":"Solid plan: we know who we\\u0027re talking to, what we want, where to find them, then how much."},"wrong":{"ar":"الترتيب مش مضبوط. جرّب تاني — الجمهور دائمًا الأول.","en":"Not quite. Try again — audience always comes first."}}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Social copy
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('copy', 'social', 2, true, true, '{"brief":{"ar":"رتّب أسبوع نشر لبراندك. اسحب كل نوع محتوى على يوم مناسب — لازم يكون فيه محتوى تعليمي وتفاعلي وتقديم عرض.","en":"Plan a publishing week for your brand. Drag each content type onto a suitable day — include educational, interactive, and an offer."},"days":[{"ar":"الأحد","en":"Sun"},{"ar":"الاثنين","en":"Mon"},{"ar":"الثلاثاء","en":"Tue"},{"ar":"الأربعاء","en":"Wed"},{"ar":"الخميس","en":"Thu"},{"ar":"الجمعة","en":"Fri"},{"ar":"السبت","en":"Sat"}],"cta":{"ar":"جدول الأسبوع","en":"Schedule the week"},"clear":{"ar":"تفريغ الأسبوع","en":"Clear week"},"engagementLabel":{"ar":"تفاعل الجمهور المتوقع","en":"Expected engagement"},"success":{"ar":"أسبوع متوازن: تعليم يبني الثقة، تفاعل يفتح الكلام، وعرض بيحوّل الاهتمام لشراء.","en":"A balanced week: education builds trust, interaction opens conversation, and the offer converts interest."},"errorEmpty":{"ar":"لسه فيه محتوى مش مجدول. كل عنصر لازم ياخد يوم.","en":"Some content is still unscheduled. Every item needs a day."},"errorMix":{"ar":"الأسبوع ناقص نوع: لازم تعليمي + تفاعلي + عرض على الأقل.","en":"The week is missing a type: at least educational + interactive + offer."}}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Ads copy
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('copy', 'ads', 3, true, true, '{"brief":{"ar":"عندك 10,000 جنيه افتراضية. وزّعها على القنوات، وشوف الوصول والنقرات والمبيعات المتوقعة بتتغير لحظيًا.","en":"You have a virtual 10,000 EGP. Split it across channels and watch reach, clicks, and expected sales update live."},"totalLabel":{"ar":"الميزانية الكلية","en":"Total budget"},"allocated":{"ar":"الموزَّع","en":"Allocated"},"remaining":{"ar":"المتبقي","en":"Remaining"},"cta":{"ar":"أطلق الحملة","en":"Launch campaign"},"errorTotal":{"ar":"لازم توزّع الـ 10,000 كلها قبل الإطلاق.","en":"You need to allocate all 10,000 before launching."},"errorSpread":{"ar":"سيب لكل قناة 1,000 جنيه على الأقل — التنويع بيقلل المخاطرة.","en":"Leave at least 1,000 EGP per channel — diversification lowers risk."},"reach":{"ar":"وصول","en":"Reach"},"clicks":{"ar":"نقرات","en":"Clicks"},"sales":{"ar":"مبيعات","en":"Sales"},"disclaimer":{"ar":"أرقام افتراضية للتعلّم — ليست نتيجة حملة حقيقية.","en":"Simulated numbers for learning — not real campaign results."}}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Launch copy
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('copy', 'launch', 4, true, true, '{"title":{"ar":"براندك بقى على الخريطة","en":"Your brand is on the map"},"body":{"ar":"خلصت الحملة من الهوية للإطلاق. الأرقام دي تقديرية بناءً على قراراتك في اللعب — مش نتيجة حملة حقيقية.","en":"You took the brand from identity to launch. These numbers are estimates based on your in-game decisions — not a real campaign result."},"reportTitle":{"ar":"تقرير براندك","en":"Your brand report"},"strengths":{"ar":"نقاط القوة","en":"Strengths"},"recommended":{"ar":"الخدمة الأنسب لك","en":"Best-fit service"},"share":{"ar":"ابعتلنا التقرير على واتساب","en":"Send us the report on WhatsApp"},"boss":{"ar":"انتقل للمرحلة الأخيرة","en":"Go to the final stage"},"replay":{"ar":"العب الحملة من جديد","en":"Replay the campaign"},"liability":{"ar":"كل الأرقام والنصوص هنا تعليمية وافتراضية. لا تُرسل أي بيانات عنك إلا لو اخترت أنت مشاركة التقرير.","en":"All numbers and text here are educational and simulated. No data about you is sent unless you choose to share the report."}}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Strength copy
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('strength', 'identity', 0, true, true, '{"ar":"هوية واضحة من أول قرار","en":"A clear identity from the first decision"}'::jsonb),
  ('strength', 'strategy', 1, true, true, '{"ar":"تفكير استراتيجي مرتب","en":"Structured strategic thinking"}'::jsonb),
  ('strength', 'community', 2, true, true, '{"ar":"قدرة على بناء مجتمع متفاعل","en":"Community-building instinct"}'::jsonb),
  ('strength', 'performance', 3, true, true, '{"ar":"حس أداء واختيار قنوات","en":"Performance and channel sense"}'::jsonb),
  ('strength', 'budget', 4, true, true, '{"ar":"توزيع ميزانية متوازن","en":"Balanced budget allocation"}'::jsonb),
  ('strength', 'content', 5, true, true, '{"ar":"محتوى متنوع وهادف","en":"Varied, purposeful content"}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Report service reasons
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('report_reason', 'social-media', 0, true, true, '{"ar":"تفاعل الأسبوع كان أقل من طموحك — خدمة إدارة السوشيال هتبني المجتمع اللي محتاجه.","en":"Your week\\u0027s engagement fell short of your ambition — social media management will build the community you need."}'::jsonb),
  ('report_reason', 'promotion', 1, true, true, '{"ar":"توزيع الميزانية محتاج تحسين — خدمة الحملات الإعلانية هتقلل تكلفة النتيجة.","en":"Your budget split needs tuning — paid campaigns will lower your cost per result."}'::jsonb),
  ('report_reason', 'digital-marketing', 2, true, true, '{"ar":"أساسك قوي، وناقصك خطة نمو موثقة بأرقام — دي خدمة التسويق الرقمي.","en":"Your foundation is solid; what\\u0027s missing is a documented growth plan — that\\u0027s digital marketing."}'::jsonb),
  ('report_reason', 'branding', 3, true, true, '{"ar":"هويتك بدأت، وناقصها نظام كامل — خدمة بناء الهوية هتخليها متسقة في كل نقطة تواصل.","en":"Your identity has started; a complete system will keep it consistent at every touchpoint."}'::jsonb),
  ('report_reason', 'content-creation', 4, true, true, '{"ar":"المحتوى هو اللي هيخلي الناس تشوف وتفتكر — خدمة صناعة المحتوى المرئي.","en":"Content is what makes people watch and remember — visual content creation."}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Prank copy
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('copy', 'prank', 5, true, true, '{"success":{"ar":"إعلانك جاب 10 مليون مشاهدة!","en":"Your ad just hit 10 million views!"},"punch":{"ar":"بهزر 😄 ده سيناريو افتراضي داخل اللعبة. النتيجة الحقيقية بتتعامل مع رَواج بأرقام موثقة.","en":"Kidding 😄 that\\u0027s a virtual in-game scenario. Real results are built with RAWAJ, with documented numbers."},"close":{"ar":"تمام، فهمت","en":"Got it"}}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Services
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('service', 'branding', 0, true, true, '{"slug":"branding","title":{"ar":"بناء الهوية البصرية","en":"Brand Identity"},"short":{"ar":"شعار، ألوان، خطوط، ودليل علامة كاملة.","en":"Logo, colors, fonts, and a complete brand guide."},"intro":{"ar":"هويتك مش مجرد شعار. دي شخصية براندك في كل نقطة تواصل.","en":"Your identity isn\\u0027t just a logo. It\\u0027s your brand\\u0027s personality at every touchpoint."},"features":{"ar":[{"title":"شعار + علامة مميزة","body":"رمز بصري يتعرف عليه جمهورك في ثوانٍ."},{"title":"لوحة ألوان + خطوط","body":"نظام لوني وخطي متسق عبر كل القنوات."},{"title":"دليل استخدام (Brand Guidelines)","body":"ملف PDF/Figma يضمن الاتساق لكل فريقك."},{"title":"تطبيقات عملية","body":"كروت، أوفيس، سوشيال، باكيج، سيجنيتشرز."}],"en":[{"title":"Logo + Mark","body":"A visual symbol your audience recognizes in seconds."},{"title":"Color Palette + Typography","body":"A consistent color and type system across all channels."},{"title":"Brand Guidelines","body":"A PDF/Figma file ensuring consistency for your whole team."},{"title":"Real-world Applications","body":"Cards, stationery, social, packaging, signatures."}]}'::jsonb),
  ('service', 'digital-marketing', 1, true, true, '{"slug":"digital-marketing","title":{"ar":"التسويق الرقمي المتكامل","en":"Integrated Digital Marketing"},"short":{"ar":"خطة نمو موثقة، قنوات، ومقاييس واضحة.","en":"A documented growth plan, channels, and clear metrics."},"intro":{"ar":"التسويق الرقمي مش مجرد بوستات. ده نظام بيقيس كل جنيه.","en":"Digital marketing isn\\u0027t just posts. It\\u0027s a system that measures every pound."},"features":{"ar":[{"title":"استراتيجية قنوات","body":"أين جمهورك؟ أي مزيج قنوات يوصل أفضل نتيجة."},{"title":"إدارة ميزانية","body":"تخصيص ديناميكي بين ميتا، جوجل، تيك توك."},{"title":"تقارير دورية","body":"أرقام حقيقية: CAC، ROAS، LTV، معدل تحويل."},{"title":"تحسين مستمر","body":"A/B testing، إعادة استهداف، توسيع ذكي."}],"en":[{"title":"Channel Strategy","body":"Where is your audience? Which channel mix delivers best."},{"title":"Budget Management","body":"Dynamic allocation across Meta, Google, TikTok."},{"title":"Regular Reporting","body":"Real numbers: CAC, ROAS, LTV, conversion rate."},{"title":"Continuous Optimization","body":"A/B testing, retargeting, smart scaling."}]}'::jsonb),
  ('service', 'social-media', 2, true, true, '{"slug":"social-media","title":{"ar":"إدارة السوشيال ميديا","en":"Social Media Management"},"short":{"ar":"محتوى يبني مجتمع، مواعيد ثابتة، وتفاعل حقيقي.","en":"Content that builds community, fixed schedule, real engagement."},"intro":{"ar":"السوشيال ميديا مش بس للنشر. ده مكان تبني فيه علاقة مع جمهورك.","en":"Social media isn\\u0027t just for posting. It\\u0027s where you build a relationship with your audience."},"features":{"ar":[{"title":"استراتيجية محتوى","body":"مزيج تعليمي/تفاعلي/عروض مصمم لبراندك."},{"title":"تقويم نشر أسبوعي","body":"مواعيد ثابتة، أنواع محتوى متنوع، مواعيد ذروة."},{"title":"إدارة مجتمع","body":"ردود، رسائل، استطلاعات، مسابقات."},{"title":"تحليل أداء","body":"معدل تفاعل، وصول، نمو متابعين، مشاعر الجمهور."}],"en":[{"title":"Content Strategy","body":"Educational/interactive/offer mix designed for your brand."},{"title":"Weekly Calendar","body":"Fixed slots, varied content types, peak timing."},{"title":"Community Management","body":"Replies, DMs, polls, contests."},{"title":"Performance Analysis","body":"Engagement rate, reach, follower growth, sentiment."}]}'::jsonb),
  ('service', 'promotion', 3, true, true, '{"slug":"promotion","title":{"ar":"الحملات الإعلانية المدفوعة","en":"Paid Ad Campaigns"},"short":{"ar":"وصول مستهدف، تكلفة أقل، مبيعات موثقة.","en":"Targeted reach, lower cost, documented sales."},"intro":{"ar":"الإعلانات المدفوعة بتوصل لجمهورك في وقت قياسي.","en":"Paid ads reach your audience in record time."},"features":{"ar":[{"title":"إعلانات ميتا/إنستجرام","body":"استهداف دقيق، لوokalike، إعادة استهداف."},{"title":"إعلانات جوجل","body":"بحث، عرض، يوتيوب، شوبينج — نية شراء عالية."},{"title":"تيك توك إعلانات","body":"محتوى أصلي، وصول عضوي مدعوم، جيل جديد."},{"title":"قياس وتحويل","body":"بكسل/CAPI، أحداث تحويل، تكلفة لكل نتيجة."}],"en":[{"title":"Meta/Instagram Ads","body":"Precise targeting, lookalike, retargeting."},{"title":"Google Ads","body":"Search, Display, YouTube, Shopping — high intent."},{"title":"TikTok Ads","body":"Native content, boosted organic reach, new gen."},{"title":"Measurement & Conversion","body":"Pixel/CAPI, conversion events, cost per result."}]}'::jsonb),
  ('service', 'content-creation', 4, true, true, '{"slug":"content-creation","title":{"ar":"صناعة المحتوى المرئي","en":"Visual Content Creation"},"short":{"ar":"تصوير، مونتاج، موشن، ريلز — جودة إنتاج عالي.","en":"Filming, editing, motion, reels — production quality."},"intro":{"ar":"المحتوى هو اللي يخلي الناس تشوف، تفتكر، وتشارك.","en":"Content is what makes people watch, remember, and share."},"features":{"ar":[{"title":"تصوير فيديو/فوتو","body":"معدات احترافية، إضاءة، توجيه إبداعي."},{"title":"مونتاج + موشن جرافيك","body":"قص، تلوين، نصوص متحركة، ترانزيشنز."},{"title":"ريلز/شورتس/تيك توك","body":"تنسيقات قصيرة، تريندز، صيغ منصات."},{"title":"إنتاج حملات متكاملة","body":"من السيناريو للتسليم النهائي بجودة بث."}],"en":[{"title":"Video/Photo Production","body":"Pro gear, lighting, creative direction."},{"title":"Editing + Motion Graphics","body":"Cut, color, animated text, transitions."},{"title":"Reels/Shorts/TikTok","body":"Short formats, trends, platform-native specs."},{"title":"Full Campaign Production","body":"From script to delivery at broadcast quality."}]}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Team
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('team', 'sobhi-saqr', 0, true, true, '{"slug":"sobhi-saqr","name":{"ar":"صهيب صقر","en":"Sobhi Saqr"},"role":{"ar":"المدير التنفيذي","en":"CEO"},"bio":{"ar":"مؤسس رَواج. خبرة 8+ سنوات في التسويق الرقمي وبناء العلامات.","en":"Founder of RAWAJ. 8+ years in digital marketing and brand building."},"photo":"https://rawaj.agency/images/team/sobhi-saqr.jpg"}'::jsonb),
  ('team', 'mohamed-amer', 1, true, true, '{"slug":"mohamed-amer","name":{"ar":"محمد عامر","en":"Mohamed Amer"},"role":{"ar":"المدير الإبداعي","en":"Creative Director"},"bio":{"ar":"مصمم ومصوّر. حول الأفكار لحملات بصرية بتقيس.","en":"Designer & photographer. Turns ideas into measurable visual campaigns."},"photo":"https://rawaj.agency/images/team/mohamed-amer.jpg"}'::jsonb),
  ('team', 'new-player', 2, true, true, '{"slug":"new-player","name":{"ar":"لاعب جديد قريبًا","en":"New player coming soon"},"role":{"ar":"—","en":"—"},"bio":{"ar":"خانة فاضية لعضو جديد — الاسم والدور والنبذة والصورة هتتضاف من ملف الفريق.","en":"A slot for a new member — name, role, bio, and photo will be added from the team file."},"photo":null}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Pricing packages
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('pricing', 'starter', 0, true, true, '{"slug":"starter","title":{"ar":"بداية","en":"Starter"},"price":{"monthly":4999,"currency":"EGP"},"features":{"ar":[{"title":"استراتيجية هوية","body":"اسم، ألوان، دليل علامة."},{"title":"استشارة تسويقية شهرية","body":"جلسة 1 ساعة + خطة 30 يوم."},{"title":"إدارة سوشيال (منصة واحدة)","body":"3 بوستات/أسبوع + ستوري."},{"title":"تقرير أداء شهري","body":"أرقام واضحة: وصول، تفاعل، نمو."}],"en":[{"title":"Brand Strategy","body":"Name, colors, brand guide."},{"title":"Monthly Marketing Consultation","body":"1hr session + 30-day plan."},{"title":"Social Management (1 platform)","body":"3 posts/week + stories."},{"title":"Monthly Performance Report","body":"Clear numbers: reach, engagement, growth."}]}'::jsonb),
  ('pricing', 'growth', 1, true, true, '{"slug":"growth","title":{"ar":"نمو","en":"Growth"},"price":{"monthly":14999,"currency":"EGP"},"features":{"ar":[{"title":"كل حاجة في بداية +","body":""},{"title":"هوية بصرية كاملة","body":"شعار، ألوان، خطوط، دليل استخدام، تطبيقات."},{"title":"إدارة سوشيال (منصتين)","body":"6 بوستات/أسبوع + ستوري يومية + مجتمع."},{"title":"حملة إعلانية شهرية (5,000 ج.م)","body":"ميتا + جوجل، تحسين أسبوعي، تقارير."},{"title":"صناعة محتوى (2 فيديو/شهر)","body":"ريلز/شورتس + مونتاج + موشن."},{"title":"جلسة استراتيجية ربع سنوية","body":"مراجعة أرقام، تعديل خطة، أهداف جديدة."}],"en":[{"title":"Everything in Starter +","body":""},{"title":"Full Visual Identity","body":"Logo, colors, typography, guidelines, applications."},{"title":"Social Management (2 platforms)","body":"6 posts/week + daily stories + community."},{"title":"Monthly Ad Campaign (5,000 EGP)","body":"Meta + Google, weekly optimization, reports."},{"title":"Content Production (2 videos/mo)","body":"Reels/Shorts + editing + motion."},{"title":"Quarterly Strategy Session","body":"Review numbers, adjust plan, new goals."}]}'::jsonb),
  ('pricing', 'scale', 2, true, true, '{"slug":"scale","title":{"ar":"توسع","en":"Scale"},"price":{"monthly":39999,"currency":"EGP"},"features":{"ar":[{"title":"كل حاجة في نمو +","body":""},{"title":"فريق مخصص","body":"مدير حساب + مصمم + مونتر + إعلامي."},{"title":"إدارة سوشيال (كل المنصات)","body":"نشر يومي + مجتمع نشط + أزمات."},{"title":"ميزانية إعلانية (15,000 ج.م/شهر)","body":"متعدد القنوات، توسيع ذكي، CAC مستهدف."},{"title":"صناعة محتوى (6 فيديو/شهر)","body":"حملة متكاملة: سيناريو، تصوير، مونتاج، موشن."},{"title":"تحليلات متقدمة + Dashboard","body":"LTV، تشارن، تنبؤات، تقارير تنفيذية."},{"title":"جلسة استراتيجية شهرية","body":"مراجعة عميقة، قرارات نمو، شراكات."}],"en":[{"title":"Everything in Growth +","body":""},{"title":"Dedicated Team","body":"Account manager + designer + editor + media buyer."},{"title":"Social Management (all platforms)","body":"Daily posts + active community + crisis."},{"title":"Ad Budget (15,000 EGP/mo)","body":"Multi-channel, smart scaling, target CAC."},{"title":"Content Production (6 videos/mo)","body":"Full campaign: script, shoot, edit, motion."},{"title":"Advanced Analytics + Dashboard","body":"LTV, churn, forecasting, exec reports."},{"title":"Monthly Strategy Session","body":"Deep review, growth decisions, partnerships."}]}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Projects/Missions (locked placeholder)
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('project', 'qahwa-house', 0, false, false, '{"slug":"qahwa-house","title":{"ar":"قهوة هاوس","en":"Qahwa House"},"category":{"ar":"هوية + سوشيال","en":"Branding + Social"},"description":{"ar":"قريباً — مشروع موثق.","en":"Coming soon — verified project."},"images":[],"metrics":{},"locked":true}'::jsonb),
  ('project', 'lumi-skin', 1, false, false, '{"slug":"lumi-skin","title":{"ar":"لومي سكين","en":"Lumi Skin"},"category":{"ar":"محتوى + إعلانات","en":"Content + Ads"},"description":{"ar":"قريباً — مشروع موثق.","en":"Coming soon — verified project."},"images":[],"metrics":{},"locked":true}'::jsonb),
  ('project', 'ofoq-real-estate', 2, false, false, '{"slug":"ofoq-real-estate","title":{"ar":"أفق العقارية","en":"Ofoq Real Estate"},"category":{"ar":"تسويق رقمي متكامل","en":"Integrated Digital Marketing"},"description":{"ar":"قريباً — مشروع موثق.","en":"Coming soon — verified project."},"images":[],"metrics":{},"locked":true}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Industries
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('industry', 'food-beverage', 0, true, true, '{"slug":"food-beverage","title":{"ar":"المأكولات والمشروبات","en":"Food & Beverage"},"description":{"ar":"مطاعم، مقاهي، علامات غذائية.","en":"Restaurants, cafes, food brands."}}'::jsonb),
  ('industry', 'real-estate', 1, true, true, '{"slug":"real-estate","title":{"ar":"العقارات","en":"Real Estate"},"description":{"ar":"مطورون، وسطاء، مشروعات سكنية.","en":"Developers, brokers, residential projects."}}'::jsonb),
  ('industry', 'health-wellness', 2, true, true, '{"slug":"health-wellness","title":{"ar":"الصحة والعافية","en":"Health & Wellness"},"description":{"ar":"عيادات، مراكز علاج، علامات صحية.","en":"Clinics, wellness centers, health brands."}}'::jsonb),
  ('industry', 'education', 3, true, true, '{"slug":"education","title":{"ar":"التعليم والتدريب","en":"Education & Training"},"description":{"ar":"أكاديميات، منصات تعليمية، ورش.","en":"Academies, edtech platforms, workshops."}}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: Testimonials
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('testimonial', 'client-1', 0, true, true, '{"slug":"client-1","author":{"ar":"عميل حقيقي","en":"Real Client"},"role":{"ar":"صاحب مشروع","en":"Business Owner"},"content":{"ar":"رَواج غيرت نظرتي للتسويق. الأرقام مش بتكذب.","en":"RAWAJ changed how I see marketing. Numbers don\\u0027t lie."},"avatar":null}'::jsonb),
  ('testimonial', 'client-2', 1, true, true, '{"slug":"client-2","author":{"ar":"عميل حقيقي","en":"Real Client"},"role":{"ar":"مدير تسويق","en":"Marketing Manager"},"content":{"ar":"الالتزام بالمواعيد والجودة كان الفرق.","en":"The commitment to deadlines and quality made the difference."},"avatar":null}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- CONTENT ITEMS: FAQs
-- =====================
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('faq', 'how-long', 0, true, true, '{"question":{"ar":"كم يستغرق بناء الهوية؟","en":"How long does brand identity take?"},"answer":{"ar":"عادة 2-3 أسابيع حسب نطاق المشروع.","en":"Usually 2-3 weeks depending on scope."}}'::jsonb),
  ('faq', 'budget-min', 1, true, true, '{"question":{"ar":"ما أقل ميزانية إعلانية؟","en":"What is the minimum ad budget?"},"answer":{"ar":"ننصح بـ 3,000-5,000 ج.م/شهر لبداية جادة.","en":"We recommend 3,000-5,000 EGP/mo for a serious start."}}'::jsonb),
  ('faq', 'contract', 2, true, true, '{"question":{"ar":"هل يوجد عقد سنوي إجباري؟","en":"Is there a mandatory yearly contract?"},"answer":{"ar":"لا، نعمل باتفاق شهري قابل للإلغاء بإشعار 30 يوم.","en":"No, we work on a monthly agreement cancellable with 30 days notice."}}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- DICTIONARIES: UI text (ar/en)
-- =====================
-- We store dictionaries as content_items for admin editing
insert into public.content_items (kind, slug, sort_order, published, visible, data)
values
  ('dict', 'nav', 0, true, true, '{"ar":{"home":"الرئيسية","about":"من نحن","services":"الخدمات","work":"المهمات","team":"الفريق","pricing":"الباقات","contact":"تواصل","campaign":"الحملة","play":"العب","cta":"تواصل معنا","switchTo":"English"},"en":{"home":"Home","about":"About","services":"Services","work":"Missions","team":"Team","pricing":"Pricing","contact":"Contact","campaign":"Campaign","play":"Play","cta":"Get in touch","switchTo":"العربية"}}'::jsonb),
  ('dict', 'common', 1, true, true, '{"ar":{"consult":"استشارة مجانية","submit":"إرسال","sending":"جاري الإرسال...","success":"تم الإرسال","error":"حصل خطأ، جرّب تاني","name":"الاسم","email":"الإيميل","phone":"التليفون","company":"الشركة","service":"الخدمة","budget":"الميزانية","message":"الرسالة","messagePlaceholder":"اكتب رسالتك هنا...","nameRequired":"الاسم مطلوب","emailRequired":"الإيميل مطلوب","emailInvalid":"إيميل غير صحيح","messageRequired":"الرسالة مطلوبة (10 حروف على الأقل)","serviceOptions":["بناء الهوية","تسويق رقمي","سوشيال ميديا","حملات إعلانية","محتوى مرئي"],"budgetOptions":["أقل من 5,000 ج.م","5,000 - 15,000 ج.م","15,000 - 40,000 ج.م","أكثر من 40,000 ج.م"],"validity":{"nameRequired":"الاسم مطلوب","emailRequired":"الإيميل مطلوب","emailInvalid":"إيميل غير صحيح","messageRequired":"الرسالة مطلوبة (10 حروف على الأقل)"}},"en":{"consult":"Free consultation","submit":"Send","sending":"Sending...","success":"Sent","error":"Something went wrong, try again","name":"Name","email":"Email","phone":"Phone","company":"Company","service":"Service","budget":"Budget","message":"Message","messagePlaceholder":"Write your message here...","nameRequired":"Name is required","emailRequired":"Email is required","emailInvalid":"Invalid email","messageRequired":"Message required (min 10 chars)","serviceOptions":["Brand Identity","Digital Marketing","Social Media","Paid Ads","Visual Content"],"budgetOptions":["Under 5,000 EGP","5,000 - 15,000 EGP","15,000 - 40,000 EGP","Over 40,000 EGP"],"validity":{"nameRequired":"Name is required","emailRequired":"Email is required","emailInvalid":"Invalid email","messageRequired":"Message required (min 10 chars)"}}}'::jsonb),
  ('dict', 'campaignPage', 2, true, true, '{"ar":{"label":"حملة رَواج","title":"براندك من الصفر… حتى الإطلاق","body":"أنت صاحب براند جديد. في 8 مراحل هتاخد قرارات التسويق اللي رَواج بتعملها مع عملائها — وتقدر تتخطى أي مرحلة وتوصل للتواصل في أي وقت.","stages":{"identity":{"title":"الهوية","tagline":"اسم براندك وألوانه من لوحة رَواج"},"strategy":{"title":"الاستراتيجية","tagline":"رتّب خطة التسويق: الجمهور، الهدف، القناة، الميزانية"},"social":{"title":"المحتوى والسوشيال","tagline":"ابنِ تقويم نشر أسبوعي يرفع تفاعل الجمهور"},"ads":{"title":"الإعلانات","tagline":"وزّع ميزانية افتراضية وشاهد وصولًا ونقرات ومبيعات تقديرية"},"replay":{"title":"غرفة العرض","tagline":"شاهد أعمال رَواج الموثقة عندما تتوفر"},"team":{"title":"الفريق","tagline":"تعرّف على الفريق الحقيقي خلف رَواج"},"launch":{"title":"الإطلاق","tagline":"لحظة النجاح وتقرير براند شخصي مبني على قراراتك"},"boss":{"title":"ابدأ مشروعك الحقيقي","tagline":"براندك جاهز. تواصل مع رَواج وابدأ التنفيذ"}}},"en":{"label":"RAWAJ Campaign","title":"Your brand, from zero… to launch","body":"You own a new brand. Across 8 stages you\\u0027ll make the marketing calls RAWAJ makes with clients — and you can skip any stage or jump to contact anytime.","stages":{"identity":{"title":"Identity","tagline":"Your brand name, RAWAJ-palette colors, and your first brand definition"},"strategy":{"title":"Strategy","tagline":"Sequence the plan: audience, goal, channel, budget"},"social":{"title":"Content & Social","tagline":"Build a weekly content calendar that lifts engagement"},"ads":{"title":"Ads","tagline":"Allocate a virtual budget and watch estimated reach, clicks, and sales"},"replay":{"title":"Replay Room","tagline":"Watch verified RAWAJ work when it becomes available"},"team":{"title":"The Team","tagline":"Meet the real team behind RAWAJ"},"launch":{"title":"Launch","tagline":"The win moment and a personal brand report built from your choices"},"boss":{"title":"Start your real project","tagline":"Your brand is ready. Contact RAWAJ and start executing"}}}}'::jsonb),
  ('dict', 'notFound', 3, true, true, '{"ar":{"label":"مش لاقي الصفحة","title":"الصفحة دي مش موجودة","body":"يمكن تكون اتمسحت أو اتنقلت. جرّب ترجع للرئيسية أو تدور على مهماتنا.","homeCta":"الرئيسية","workCta":"المهمات"},"en":{"label":"Page not found","title":"This page doesn\\u0027t exist","body":"It might have been moved or deleted. Try going back home or browsing our missions.","homeCta":"Home","workCta":"Missions"}}'::jsonb),
  ('dict', 'contactPage', 4, true, true, '{"ar":{"label":"تواصل","title":"ابدأ مشروعك مع رَواج","body":"كل قرار خدته في الحملة بيرجّعك لسؤال: مين ينفّذ؟ رَواج بتنفّذ الشغل ده على أرض الواقع. ابدأ بمكالمة أو رسالة.","formTitle":"ابعتلنا تفاصيل مشروعك","formBody":"هنرد عليك خلال 24 ساعة.","name":"الاسم","email":"الإيميل","phone":"التليفون","company":"الشركة","service":"الخدمة","budget":"الميزانية","message":"الرسالة","messagePlaceholder":"اكتب تفاصيل مشروعك، أهدافك، وأي معلومات تانية تساعدنا نفهمك أفضل.","submit":"إرسال","sending":"جاري الإرسال...","successTitle":"تم استلام رسالتك","successBody":"فريق رَواج هيتواصل معاك خلال 24 ساعة.","error":"تعذر إرسال الرسالة. جرّب تاني أو تواصل مباشرة.","emailLabel":"الإيميل","phoneLabel":"التليفون","addressLabel":"العنوان","hoursLabel":"ساعات العمل","followLabel":"تابعنا","responseTitle":"مدة الرد","responseBody":"بنرد على كل الاستفسارات خلال يوم عمل واحد. لو الموضوع مستعجل، اتصل مباشرة.","mapTitle":"موقعنا على الخريطة","mapLink":"افتح في خرائط جوجل","newsletterTitle":"خليك في اللوب","newsletterBody":"أخبار، نصائح، ودراسات حالة — مرة واحدة في الشهر، من غير سبام.","newsletterPlaceholder":"إيميلك هنا","subscribe":"اشترك","subscribed":"تم الاشتراك!","newsletterError":"الإيميل مستخدم بالفعل أو غير صحيح."},"en":{"label":"Contact","title":"Start your project with RAWAJ","body":"Every decision in the campaign leads to one question: who executes? RAWAJ does this in real life. Start with a call or a message.","formTitle":"Send us your project details","formBody":"We\\u0027ll reply within 24 hours.","name":"Name","email":"Email","phone":"Phone","company":"Company","service":"Service","budget":"Budget","message":"Message","messagePlaceholder":"Tell us about your project, goals, and anything else that helps us understand you better.","submit":"Send","sending":"Sending...","successTitle":"Message received","successBody":"The RAWAJ team will get back to you within 24 hours.","error":"Failed to send. Try again or contact directly.","emailLabel":"Email","phoneLabel":"Phone","addressLabel":"Address","hoursLabel":"Working hours","followLabel":"Follow us","responseTitle":"Response time","responseBody":"We reply to all inquiries within one business day. For urgent matters, call directly.","mapTitle":"Our location on the map","mapLink":"Open in Google Maps","newsletterTitle":"Stay in the loop","newsletterBody":"News, tips, and case studies — once a month, no spam.","newsletterPlaceholder":"Your email","subscribe":"Subscribe","subscribed":"Subscribed!","newsletterError":"Email already in use or invalid."}}'::jsonb),
  ('dict', 'footer', 5, true, true, '{"ar":{"tagline":"رَواج — بنبني علامات من الصفر.","quickLinks":"روابط سريعة","servicesTitle":"خدماتنا","contactTitle":"تواصل معنا","emailLabel":"الإيميل","phoneLabel":"التليفون","addressLabel":"العنوان","hoursLabel":"ساعات العمل","followLabel":"تابعنا","newsletterTitle":"خليك في اللوب","newsletterBody":"أخبار، نصائح، ودراسات حالة — مرة واحدة في الشهر، من غير سبام.","newsletterPlaceholder":"إيميلك هنا","subscribe":"اشترك","subscribed":"تم الاشتراك!","newsletterError":"الإيميل مستخدم بالفعل أو غير صحيح.","rights":"كل الحقوق محفوظة.","madeBy":"صنع بـ"},"en":{"tagline":"RAWAJ — building brands from zero.","quickLinks":"Quick links","servicesTitle":"Our services","contactTitle":"Contact us","emailLabel":"Email","phoneLabel":"Phone","addressLabel":"Address","hoursLabel":"Working hours","followLabel":"Follow us","newsletterTitle":"Stay in the loop","newsletterBody":"News, tips, and case studies — once a month, no spam.","newsletterPlaceholder":"Your email","subscribe":"Subscribe","subscribed":"Subscribed!","newsletterError":"Email already in use or invalid.","rights":"All rights reserved.","madeBy":"Made with"}}'::jsonb)
on conflict (kind, slug) do update set data = excluded.data, updated_at = now();

-- =====================
-- REPLAY VIDEOS: empty (added from admin only)
-- =====================
-- No seed data for replay_videos - they are added from /admin only

-- =====================
-- CHANNELS: empty (added from admin only)
-- =====================
-- No seed data for channels - they are added from /admin only

-- =====================
-- COMPLETE
-- =====================
select 'RAWAJ content seed completed' as status;