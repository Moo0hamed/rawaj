# PROGRESS.md

## الحالة الحالية
- Step 0 (Orient): مكتمل.
- Step 1 (housekeeping): مكتمل - إزالة لوج debug، إضافة 003 grants، رسائل خطأ أوضح، اختبار RLS للـ anon.
- Step 2 (نظام الثيمات والغراء): مكتمل - 12 ثيمة، خطوط، ماسكوت، انتقالات، simple mode، reduced motion، 30fps canvas.
- Step 3 (ثلاث عينات ثيمات): مكتمل - T5 Ads، T4 Social، T9 Contact مع لقطات شاشة.
- Step 4 (باقي الثيمات): **مكتمل بالكامل** - جميع الـ10 ثيمات مع لقطات شاشة.
- Step 5a (migrate file content to DB): **مكتمل** - تم إنشاء supabase/seed-content.sql بجميع المحتوى (stages, palette, strategy, social, ads, launch, identity copy, strength, mascot lines, services, team, pricing, projects, industries, testimonials, FAQs, dictionaries, site settings). جاهز للتشغيل في Supabase SQL Editor.

## التالي
- Step 5b: Replay Room reading videos from DB (lazy player, +10 XP once per video, cap 50).
- Step 5c: Channels room with server-side fetch (YouTube API + OG/oEmbed), 24h refresh + 'refresh now' button.
- Step 5d: Dual-personality MVP (one glitch event, first-time warning, Safe button, mascot expressions, 8 random events).
- Step 6: النشر.

## التحقق
- 	sc و uild ناجحان.

## قرارات
- لا أسرار، لا بيانات وهمية، ألوان/شعار محفوظة، RTL/ar + en، رعب/مقالب مزحة واضحة.

## مشاكل مفتوحة
- خط Pixelify Sans variable 404 (fallback يعمل).
- Seed SQL يحتاج تشغيل في Supabase SQL Editor من المالك.
