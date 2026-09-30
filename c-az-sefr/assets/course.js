/* فهرست کامل دوره «C برای میکروکنترلر» — تنها منبع حقیقت برای منو، صفحه‌بندی و نقشه راه.
   هر درس: id (نام فایل بدون .html)، عنوان، زمان تقریبی مطالعه (دقیقه)، سطح. */
window.COURSE = {
  title: "C برای میکروکنترلر",
  chapters: [
    { n: 1, title: "قبل از نوشتن اولین خط", color: "#FFC400", ink: "#1a1200", lessons: [
      { id: "1-1", title: "میکروکنترلر چیست و C چه نقشی دارد؟", min: 30, level: "صفر مطلق" },
      { id: "1-2", title: "اعداد در دنیای کامپیوتر: باینری، هگز، بیت و بایت", min: 40, level: "صفر مطلق" },
      { id: "1-3", title: "جعبه‌ابزار: همه ابزارهایی که لازم داری", min: 40, level: "صفر مطلق" },
      { id: "1-4", title: "اولین برنامه و مسیر کد تا اجرا شدن", min: 45, level: "صفر مطلق" }
    ]},
    { n: 2, title: "ستون‌های زبان C", color: "#3B6FE0", ink: "#ffffff", lessons: [
      { id: "2-1", title: "متغیر و حافظه", min: 45, level: "مبتدی" },
      { id: "2-2", title: "انواع داده و stdint.h", min: 50, level: "مبتدی" },
      { id: "2-3", title: "عملگرها", min: 45, level: "مبتدی" },
      { id: "2-4", title: "شرط‌ها: تصمیم گرفتن در کد", min: 40, level: "مبتدی" },
      { id: "2-5", title: "حلقه‌ها: تکرار بدون کپی کردن", min: 45, level: "مبتدی" },
      { id: "2-6", title: "توابع: تکه‌تکه کردن کد", min: 50, level: "مبتدی" },
      { id: "2-7", title: "آرایه‌ها", min: 45, level: "مبتدی" },
      { id: "2-8", title: "رشته‌ها و printf", min: 50, level: "مبتدی تا متوسط" }
    ]},
    { n: 3, title: "نزدیک به سخت‌افزار", color: "#1FB57A", ink: "#03210f", lessons: [
      { id: "3-1", title: "عملگر بیتی و ماسک: زبان رجیسترها", min: 55, level: "متوسط" },
      { id: "3-2", title: "اشاره‌گر (۱): آدرس و مقدار", min: 55, level: "متوسط" },
      { id: "3-3", title: "اشاره‌گر (۲): آرایه، حساب آدرس و const", min: 55, level: "متوسط" },
      { id: "3-4", title: "struct، union، enum، typedef و تراز حافظه", min: 60, level: "متوسط" },
      { id: "3-5", title: "نقشه حافظه و طول عمر متغیر", min: 55, level: "متوسط" },
      { id: "3-6", title: "رجیستر و volatile", min: 55, level: "متوسط" }
    ]},
    { n: 4, title: "ساختن پروژه واقعی", color: "#FF7A1A", ink: "#1f0d00", lessons: [
      { id: "4-1", title: "پیش‌پردازنده و ماکرو", min: 45, level: "متوسط" },
      { id: "4-2", title: "پروژه چندفایلی: header، extern و build", min: 55, level: "متوسط" },
      { id: "4-3", title: "اشاره‌گر به تابع و callback", min: 50, level: "متوسط تا پیشرفته" },
      { id: "4-4", title: "حافظه پویا و چرا در میکروکنترلر احتیاط می‌کنیم", min: 45, level: "متوسط" },
      { id: "4-5", title: "ساختار داده در embedded: بافر حلقوی", min: 55, level: "پیشرفته" },
      { id: "4-6", title: "ماشین حالت (FSM)", min: 55, level: "پیشرفته" },
      { id: "4-7", title: "ریاضی روی میکروکنترلر: عدد ثابت، سرریز و endianness", min: 55, level: "پیشرفته" }
    ]},
    { n: 5, title: "C روی سخت‌افزار واقعی", color: "#F0508C", ink: "#2b0016", lessons: [
      { id: "5-1", title: "بوت شدن میکروکنترلر: startup، vector table و linker script", min: 60, level: "پیشرفته" },
      { id: "5-2", title: "Bare-metal روی STM32: GPIO با رجیستر", min: 60, level: "پیشرفته" },
      { id: "5-3", title: "وقفه و ISR", min: 60, level: "پیشرفته" },
      { id: "5-4", title: "تایمر، SysTick و زمان‌بندی بدون delay", min: 55, level: "پیشرفته" },
      { id: "5-5", title: "UART، SPI و I2C از دید کد C", min: 65, level: "پیشرفته" },
      { id: "5-6", title: "ESP32 با C خالص: ESP-IDF و FreeRTOS", min: 65, level: "پیشرفته" },
      { id: "5-7", title: "معماری لایه‌ای درایور و HAL", min: 55, level: "پیشرفته" }
    ]},
    { n: 6, title: "حرفه‌ای شدن", color: "#7C4DEB", ink: "#ffffff", lessons: [
      { id: "6-1", title: "دیباگ: printf، assert، GDB، تحلیلگر منطقی و HardFault", min: 60, level: "پیشرفته" },
      { id: "6-2", title: "رفتار تعریف‌نشده و تله‌های C", min: 55, level: "پیشرفته" },
      { id: "6-3", title: "کد امن: MISRA C، CERT C و آنالیز ایستا", min: 50, level: "پیشرفته" },
      { id: "6-4", title: "تست واحد روی PC: Unity و mock", min: 55, level: "پیشرفته" },
      { id: "6-5", title: "بهینه‌سازی، اندازه کد و فایل map", min: 55, level: "پیشرفته" }
    ]},
    { n: 7, title: "پروژه پایانی و ادامه راه", color: "#0EB5CC", ink: "#00232a", lessons: [
      { id: "7-1", title: "پروژه پایانی: ثبت‌کننده دما برای ESP32 و STM32", min: 90, level: "پیشرفته" },
      { id: "7-2", title: "مسیر بعدی: RTOS، Rust، کتاب‌ها و گواهی‌ها", min: 30, level: "همه سطوح" }
    ]}
  ],
  extras: [
    { id: "index", title: "خانه و نقشه راه" },
    { id: "tools", title: "جعبه‌ابزار کامل" },
    { id: "glossary", title: "واژه‌نامه" },
    { id: "troubleshooting", title: "عیب‌یابی: رمزگشای خطاها" },
    { id: "cheatsheet", title: "برگه خلاصه قابل چاپ" },
    { id: "references", title: "منابع و مراجع" }
  ]
};
