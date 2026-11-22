# Supabase setup — خطوات سريعة

إذا فشل Supabase CLI، نفّذ التالي مرة واحدة في SQL Editor:

1. افتح https://supabase.com/dashboard/project/cbbytmcocumjbntzopjx/sql/new
2. انسخ محتوى الملف `supabase/all-in-one.sql` كاملاً والصقه في المحرر.
3. اضغط **Run** وانتظر "Success".
4. شغّل الموقع محلياً (`npm run dev`) وافتح `/admin/setup`.
5. أنشئ حساباً بالبريد `123ONETWO123123@GMAIL.COM` وكلمة مرور تختارها، ثم اضغط "أنا مالك الموقع".
6. إذا طُلب تأكيد البريد: افتح رسالة Supabase في بريدك واضغط رابط التأكيد ثم سجّل دخولك وكرر "أنا مالك الموقع".

ملاحظة: لا تشارك أي مفتاح secret/service_role أو كلمة مرور قاعدة البيانات في المحادثة.
