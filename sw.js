const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// حفظ الملفات عند التثبيت
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

// تشغيل الملفات المحفوظة عند انقطاع الإنترنت
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

let deferredPrompt;
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');

// 1. التقاط الحدث عندما يقرأ المتصفح أن التطبيق قابل للتثبيت
window.addEventListener('beforeinstallprompt', (e) => {
    // منع المتصفح من عرض الإشعار الافتراضي الصغير
    e.preventDefault();
    // حفظ الحدث لاستخدامه عند ضغط المستخدم على الزر
    deferredPrompt = e;
    // إظهار الشريط الذي قمنا بتصميمه (تلقائياً فور توفر الحدث)
    installBanner.style.display = 'block';
});

// 2. تفعيل نافذة التثبيت الرسمية عند الضغط على زرنا
installBtn.addEventListener('click', async () => {
    // إخفاء الشريط الخاص بنا
    installBanner.style.display = 'none';
    
    // إظهار نافذة التثبيت الرسمية الخاصة بنظام أندرويد
    if (deferredPrompt) {
        deferredPrompt.prompt();
        // انتظار رد المستخدم (هل ضغط تثبيت أم إلغاء؟)
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`نتيجة التثبيت: ${outcome}`);
        // تفريغ المتغير لأنه يُستخدم مرة واحدة فقط
        deferredPrompt = null;
    }
});

// 3. إخفاء الشريط نهائياً إذا كان التطبيق مثبتاً بالفعل
window.addEventListener('appinstalled', () => {
    installBanner.style.display = 'none';
    console.log('تم تثبيت التطبيق بنجاح');
});
