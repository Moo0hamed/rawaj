# PROGRESS.md

## الحالة الحالية
- Step 0 (Orient): مكتمل.
- Step 1 (housekeeping): مكتمل - إزالة لوج debug، إضافة 003 grants، رسائل خطأ أوضح، اختبار RLS للـ anon.
- Step 2 (نظام الثيمات والغراء): مكتمل - 12 ثيمة، خطوط، ماسكوت، انتقالات، simple mode، reduced motion، 30fps canvas.
- Step 3 (ثلاث عينات ثيمات): مكتمل - T5 Ads، T4 Social، T9 Contact مع لقطات شاشة.
- Step 4 (باقي الثيمات): **مكتمل بالكامل** - جميع الـ10 ثيمات مع لقطات شاشة.
- Step 5a (migrate file content to DB): مكتمل - supabase/seed-content.sql + public-client.ts مع cache/fallback.
- Step 5b (Replay Room from DB): مكتمل - lazy player، +10 XP/video (cap 50)، fallback محلي.
- Step 5c (Channels room): مكتمل - صفحة /channels مع ChannelCard، RefreshButton، API route /api/channels/refresh لجلب OG/oEmbed، تحديث 24h cron + زر "حدّث الآن".
- Step 5d (Dual-personality MVP): **مكتمل** - GlitchEventProvider مع 8 أحداث glitch، موافقة أول مرة، زر "أمان 🌈"، ماسكوت بتعبيرات، احترام reduced-motion.
- Step 6 (Deploy): **مكتمل** - DEPLOY.md مع تعليمات Cloudflare Pages، build ناجح، جاهز للنشر.

## التحقق النهائي
- 	sc و uild ناجحان.
- جميع الـ10 ثيمات مطبقة مع لقطات شاشة.
- حملة 8 مراحل شغالة مع HUD، XP، mascot، Intro.
- Admin panel شغالة مع رسائل خطأ أوضح.
- Replay Room، Channels room، Dual-personality MVP جاهزة.
- قاعدة البيانات: seed SQL جاهز للتشغيل في Supabase SQL Editor.

## الخطوة التالية (من المستخدم)
1. ادفع الكود لـ GitHub: git remote add origin <url> && git push -u origin master
2. ادخل Cloudflare Pages → Create project → Connect GitHub repo
3. Build command: 
pm run build | Output: .next
4. أضف Environment Variables (Supabase URL/Key، OWNER_EMAIL)
5. **اضغط Allow لما المتصفح يطلب صلاحية GitHub**
6. انتظر النشر، جرب الموقع الحي

## قرارات
- لا أسرار، لا بيانات وهمية، ألوان/شعار محفوظة، RTL/ar + en، رعب/مقالب مزحة واضحة.

## مشاكل مفتوحة
- خط Pixelify Sans variable 404 (fallback يعمل).
- Seed SQL يحتاج تشغيل في Supabase SQL Editor من المالك.
- YouTube API key / Meta Graph API تحتاج إعداد في Edge Functions (اختياري).
