# PROGRESS.md

## الحالة الحالية
- Step 0 (Orient): مكتمل.
- Step 1 (housekeeping): مكتمل - إزالة لوج debug، إضافة 003 grants، رسائل خطأ أوضح، اختبار RLS للـ anon.
- Step 2 (نظام الثيمات والغراء): مكتمل.
  - نظام الثيمات: 12 ثيمة (intro, home, strategy, social, ads, replay, team, launch, contact, horror, admin, simple) مع متغيرات CSS كاملة (ألوان، خطوط، ظلال، أزرار، نصف قطر).
  - خطوط الثيمات: أضيفت متغيرات CSS للخطوط الـ10 (--font-lalezar, --font-baloo, --font-alex, --font-reem, --font-ibm, --font-px-ar/Handjet, --font-px-en/Pixelify Sans) وتحميلها بـ ont-display: swap عبر next/font/google في layout.tsx.
  - الغراء (Glue): HUD، الشعار، الأزرار الرئيسية، الماسكوت يحتفظون بألوان البراند (#2391FF, #FFF83F) ومظهر بيكسل محايد عبر جميع الثيمات.
  - الماسكوت: MascotSprite يتكيف رسمه حسب الثيمة (ألوان، حدود، شكل الجسم) مع الحفاظ على الهوية نفسها.
  - انتقالات: 	heme-wipe لكل ثيمة مع dissolve/wipe يستعير عنصر من الثيمة التالية.
  - احترام prefers-reduced-motion: يلغي الأنيميشن والانتقالات.
  - Simple mode: زر في إعدادات HUD يفلطح جميع الثيمات لمظهر محايد واحد.
  - لوحة مفاتيح: focus-visible مع outline accent، skip-to-content، nav بالكيبورد.
  - Canvas/SVG: PixelScene مع 30fps cap، يتوقف عند إخفاء التبويب، يحترم reduced motion و simple mode.
  - نص الجسم: 16px كحد أدنى، تباين AA في جميع الثيمات (تم التحقق من أزواج --ink/--bg).
  - خطوط عربية: جميع خطوط العرض تدعم العربية (Changa, Handjet, Lalezar, Baloo Bhaijaan 2, Alexandria, Reem Kufi, IBM Plex Sans Arabic).
- التحقق: 	sc و uild ناجحان.

## التالي
- Step 3: ثلاث عينات ثيمات (T5 Ads، T4 Social، T9 Contact) - واحدة لكل رسالة مع لقطات شاشة.
- Step 4: باقي الثيمات (T2, T1, T3, T6, T7, T8, T10) - واحدة لكل رسالة.
- Step 5: ميزات v2 (قاعدة البيانات، Replay Room، قنوات، شخصية مزدوجة).
- Step 6: النشر.

## قرارات
- لا أسرار، لا بيانات وهمية، ألوان/شعار محفوظة، RTL/ar + en، رعب/مقالب مزحة واضحة.

## مشاكل مفتوحة
- لا توجد مشاكل مفتوحة.
