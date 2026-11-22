# رَواج — RAWAJ

موقع وكالة تسويق رقمي ثنائي اللغة (العربية RTL / الإنجليزية LTR) مبني بـ Next.js App Router وTypeScript وTailwind CSS وFramer Motion، بتجربة «الموقع هو اللعبة»: حملة تفاعلية من 8 مراحل مع HUD دائم، نقاط XP/عملات، ماسكوت، وتقرير براند قابل للمشاركة — مع الحفاظ على المحتوى المهني وبيانات التواصل الحقيقية.

## التشغيل

```bash
npm install
npm run dev        # http://localhost:3000 (افتراضي)
npm run build      # بناء إنتاجي
npm start
npm run typecheck  # فحص TypeScript
```

- المسارات: العربية `/ar` (افتراضي) والإنجليزية `/en`. الزيارة إلى `/` تُحوَّل تلقائيًا حسب لغة المتصفح.
- الخطوط مستضافة محليًا في `public/fonts` ومُعرَّفة بـ `@font-face` في `app/globals.css` (بدون `next/font/google`).

## الهوية البصرية

- الأزرق الأساسي: `#2391FF`
- الأصفر المميز: `#FFF83F`
- ثيم داكن: `#050D1A` / `#03080F` / `#0A1626` مع نص `#E9F1FF`
- رموز الألوان في `tailwind.config.ts` (`brand`, `accent`, `ink`, `paper`, `night`, `abyss`, `surface`)

## تجربة الحملة (Campaign Mode) — 8 مراحل

الصفحة الرئيسية `/[locale]` و`/[locale]/campaign` تعرض رحلة من 8 مراحل بالترتيب:

1. **الهوية** — اسم البراند واختيار ألوان من هوية رَواج. (`+20 XP, 3 coins`)
2. **الاستراتيجية** — ترتيب خطوات التسويق (جمهور → هدف → قناة → ميزانية). (`+20 XP, 3 coins`)
3. **المحتوى والسوشيال** — بناء تقويم نشر أسبوعي متوازن واحتساب تفاعل تقديري. (`+20 XP, 3 coins`)
4. **الإعلانات** — توزيع ميزانية افتراضية 10,000 ج.م ومشاهدة وصول/نقرات/مبيعات تقديرية. (`+20 XP, 3 coins`)
5. **غرفة العرض (Replay)** — عرض أعمال رَواج الموثقة عند توفرها (`+10 XP` لكل فيديو موثق يُشاهد، بحد أقصى `50 XP`). إذا لم تتوفر فيديوهات متحقق منها تُعرض رسالة «الفيديوهات الجاية قريبًا» مع تعليمات للمالك، وتتجاوز المرحلة تلقائيًا عند الدخول **بدون XP**.
6. **الفريق** — التعرف على الفريق الحقيقي (بيانات مؤكدة فقط). (`+10 XP` عند فتح بطاقتي الفريق الأساسيتين)
7. **الإطلاق** — تقرير براند مبني على قرارات المراحل 1–4 (مع قيم افتراضية محايدة عند التخطي) + مشاركة واتساب. (`+40 XP, 5 coins`)
8. **Boss: ابدأ مشروعك الحقيقي** — تواصل مع رَواج (واتساب بتقرير مملوء مسبقًا، اتصال، بريد، خريطة/صفحة التواصل). (`+30 XP` عند أول ضغطة تواصل)

**قواعد عامة**
- التخطي متاح دائمًا **بدون XP**، ويمكن العودة/الانتقال بين المراحل.
- مستويات XP (3): `BEGINNER` (0)، `EXPLORER` (180)، `RAWAJ LEGEND` (420). XP الإجمالي من مكافآت المراحل وحدها لا يصل لمستوى `RAWAJ LEGEND`.
- HUD دائم: خريطة مراحل (8)، XP/عملات/مستوى، وإعدادات (صوت/حركة/مقالب/إعادة تعيين). زر التواصل/مرحلة Boss في الـ HUD يصل لمرحلة Boss (`#boss`) بضغطة.
- التخزين محلي فقط: `localStorage` (`rawaj-game-v1`) و`sessionStorage` (`rawaj-mascot-off`, `rawaj-intro-seen`) — بدون تسجيل دخول ولا إرسال بيانات للخادم.
- كل الأرقام داخل الحملة تقديرية/تعليمية وليست نتائج حملات حقيقية. لا عملاء/أرقام/شهادات وهمية، ولا ميديا غير متحقق منها في `content/showcase.ts`.

## البنية والتقنيات

| الأداة | الاستخدام |
| --- | --- |
| Next.js 15 (App Router) | التوجيه، SSG، Metadata API |
| TypeScript | سلامة الأنواع |
| Tailwind CSS | نظام التصميم الداكن |
| Framer Motion | انتقالات المراحل/HUD مع احترام `prefers-reduced-motion` |

مسارات مهمة: `app/[locale]/{page.tsx,campaign/,about,services,work,team,pricing,contact,play}`, `components/{campaign,game,layout,sections,work,contact,pricing,seo,ui}`, `content/{campaign.ts,showcase.ts,site.ts,services.ts,projects.ts,team.ts,playground.ts,dictionaries}`, `lib/{i18n.ts,nav.ts,game.ts,sound.ts,utils.ts}`.

## تعديل المحتوى

1. **بيانات الشركة/التواصل** — `content/site.ts` (الهاتف/واتساب، البريد، العنوان، الروابط).
2. **نصوص ومراحل الحملة** — `content/campaign.ts`.
3. **أعمال موثقة للعرض (Replay)** — `content/showcase.ts` (لا تُضاف ميديا غير متحقق منها).
4. **الخدمات/الفريق/الباقات/المهمات** — `content/services.ts`, `content/team.ts`, `content/pricing.ts`, `content/projects.ts` (المهمات المقفولة `locked: true` بدون بيانات غير موثقة).
5. **نصوص الواجهة** — `content/dictionaries/ar.ts` و`en.ts`.
6. **الصور** — `public/images/`.

## الفحوصات والاختبارات

بعد `npm run build` و`npm start` (أو أثناء `npm run dev`) على منفذ معين:

```bash
# base URL للسكريبتات (افتراضي http://localhost:3000)
$env:BASE_URL="http://localhost:3000"   # PowerShell
# أو: BASE_URL=http://localhost:3000 node ...

node scripts/qa.js           # الصفحات، الكونسول، الصور، العرض، RTL/LTR، الجوال
node scripts/flows.js        # التنقل، اللغة، الفلاتر، الباقات، التواصل، الخدمات، HUD
node scripts/campaign-qa.js  # رحلة الحملة الكاملة (8 مراحل) والتقرير/الواتساب/#boss والاستمرارية
node scripts/game-qa.js      # شاشة البداية، ألعاب/مقالب، الهيدر
node scripts/crawl.js        # الروابط الداخلية وحالات 404/إعادة التوجيه
```

> السكريبتات تستخدم `puppeteer-core` مع Chrome المثبّت. عدّل مسار `CHROME` أعلى الملف إذا لزم. راجع `NEXT_PUBLIC_SITE_URL` في `.env.local` وبيانات التواصل في `content/site.ts` قبل النشر.