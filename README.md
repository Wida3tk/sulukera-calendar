# Sulukera Academic Calendar

نظام تقويم وجدولة أكاديمية لسلوكيرا، مبني كموقع ثابت على GitHub Pages مع Firebase Authentication وFirestore.

## الصفحات

- `index.html`: التقويم العام للطلاب والخطط المنشورة.
- `planner.html`: المخطط الذكي للإدارة (قوالب، تعارضات، مسودة/نشر).
- `admin.html`: إدارة تقاويم البرامج القديمة والفصول.
- `schedule.html`: جداول المحاضرات.
- `savethedate.html`: بطاقات مواعيد بدء البرامج.

## القوالب الذكية

- ABA: أربعة أسابيع دراسة، أسبوع اختبارات، أسبوع إجازة.
- OBM Practitioner: ثلاثة مقررات، أسبوعان لكل مقرر.
- OBM Advanced: ثلاثة مقررات، أسبوعان لكل مقرر.

## تشغيل محلي

استخدم أي خادم ملفات ثابتة؛ فتح الملفات مباشرة عبر `file://` لا يشغّل ES modules بشكل موثوق.

```powershell
python -m http.server 8080
```

ثم افتح `http://localhost:8080/`.

## Firebase

انشر قواعد الأمان قبل استخدام مجموعة `academic_plans`:

```powershell
firebase deploy --only firestore:rules
```

المفتاح الموجود في إعداد Firebase هو معرّف تطبيق ويب وليس سرًا. الحماية تعتمد على Authentication وFirestore Rules.

## مصادر الإجازات

الإجازات الثابتة (يوم التأسيس واليوم الوطني) والتواريخ المؤكدة تحفظ في `js/scheduler.js`. تواريخ الأعياد المستقبلية تحمل حالة `tentative` إلى أن يصدر الإعلان الرسمي.
