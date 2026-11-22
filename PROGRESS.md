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
- Step 5d (Dual-personality MVP): **مكتمل** - GlitchEventProvider مع:
  - 8 أحداث glitch عشوائية (static attack, inverted colors, mascot takeover, fake crash, glitched text, audio glitch, portal open, safe mode trigger)
  - موافقة أول مرة (consent modal) مع قواعد واضحة
  - زر "أمان 🌈" لإيقاف المقالب فورًا
  - ماسكوت بتعبيرات مختلفة لكل حدث (happy, excited, surprised, shocked, scared, evil, sad, wink)
  - احترام prefers-reduced-motion و simple mode
  - Keyboard escape لإغلاق المقالب
  - ماسكوت horror theme في GlitchEventProvider
- التحقق: 	sc و uild ناجحان.

## التالي
- Step 6: النشر (Preview ثم Production على Cloudflare Pages أو Vercel).

## التحقق
- 	sc و uild ناجحان.

## قرارات
- لا أسرار، لا بيانات وهمية، ألوان/شعار محفوظة، RTL/ar + en، رعب/مقالب مزحة واضحة.

## مشاكل مفتوحة
- خط Pixelify Sans variable 404 (fallback يعمل).
- Seed SQL يحتاج تشغيل في Supabase SQL Editor من المالك.
- YouTube API key / Meta Graph API تحتاج إعداد في Edge Functions (اختياري).
