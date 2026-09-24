/* فهرست کامل دوره — تنها منبع حقیقت برای منو، صفحه‌بندی و نقشه راه.
   هر درس: id (نام فایل بدون .html)، عنوان، زمان تقریبی مطالعه (دقیقه)، سطح. */
window.COURSE = {
  title: "مستر کلاس ESP32 فارسی", title_en: "ESP32 Masterclass",
  /* صفحه‌هایی که نسخه انگلیسی آن‌ها منتشر شده؛ وقتی همه آماده شد مقدار "all" می‌گیرد */
  enPages: "all",
  chapters: [
    { n: 1, title: "آشنایی با سخت‌افزار ESP32", title_en: "Meet the ESP32 hardware", color: "#2f7af0", lessons: [
      { id: "1-1", title: "ESP32 چیست؟ مقایسه با آردوینو و رزبری پای", min: 35, level: "مبتدی", title_en: "What is the ESP32? Compared with Arduino and Raspberry Pi", level_en: "Beginner" },
      { id: "1-2", title: "انواع برد ESP32 و انتخاب درست", min: 30, level: "مبتدی", title_en: "ESP32 board variants and how to choose", level_en: "Beginner" },
      { id: "1-3", title: "نقشه پایه‌ها (Pinout) بدون ترس", min: 45, level: "مبتدی", title_en: "The pinout, without fear", level_en: "Beginner" },
      { id: "1-4", title: "کارگاه عملی: برد بورد، مولتی‌متر، لحیم‌کاری و تغذیه مدار", min: 60, level: "مبتدی", title_en: "Hands-on bench: breadboard, multimeter, soldering and power", level_en: "Beginner" }
    ]},
    { n: 2, title: "نصب ابزار و اولین برنامه", title_en: "Tools and your first program", color: "#12a37f", lessons: [
      { id: "2-1", title: "نصب Arduino IDE و PlatformIO", min: 40, level: "مبتدی", title_en: "Installing Arduino IDE and PlatformIO", level_en: "Beginner" },
      { id: "2-2", title: "اولین برنامه: چشمک زدن LED خط به خط", min: 50, level: "مبتدی", title_en: "First program: blinking an LED, line by line", level_en: "Beginner" },
      { id: "2-3", title: "شبیه‌ساز Wokwi: بدون سخت‌افزار شروع کن", min: 30, level: "مبتدی", title_en: "The Wokwi simulator: start with no hardware", level_en: "Beginner" }
    ]},
    { n: 3, title: "ورودی، خروجی و پروتکل‌های سخت‌افزاری", title_en: "Inputs, outputs and hardware protocols", color: "#e0781f", lessons: [
      { id: "3-1", title: "ورودی و خروجی دیجیتال و آنالوگ: دکمه، پتانسیومتر، LDR", min: 55, level: "مبتدی تا متوسط", title_en: "Digital and analog I/O: buttons, potentiometers and LDRs", level_en: "Beginner to intermediate" },
      { id: "3-2", title: "PWM: کم‌نور کردن LED و کنترل سروو", min: 50, level: "متوسط", title_en: "PWM: dimming LEDs and driving servos", level_en: "Intermediate" },
      { id: "3-3", title: "I2C، SPI و UART: نمایشگر OLED، سنسور DHT22، کارت SD و GPS", min: 70, level: "متوسط", title_en: "I2C, SPI and UART: OLED, DHT22, SD card and GPS", level_en: "Intermediate" },
      { id: "3-4", title: "راه‌اندازی بارهای پرمصرف: ترانزیستور، ماسفت، رله، موتور، استپر و LED آدرس‌پذیر", min: 75, level: "متوسط", title_en: "Driving heavy loads: transistors, MOSFETs, relays, motors, steppers and addressable LEDs", level_en: "Intermediate" }
    ]},
    { n: 4, title: "ارتباط بی‌سیم", title_en: "Wireless communication", color: "#8b4fd6", lessons: [
      { id: "4-1", title: "Wi-Fi: اتصال پایدار و اتصال دوباره خودکار", min: 45, level: "متوسط", title_en: "Wi-Fi: reliable connection and automatic reconnect", level_en: "Intermediate" },
      { id: "4-2", title: "وب سرور: کنترل وسایل خانه از مرورگر", min: 60, level: "متوسط", title_en: "Web server: control your home from a browser", level_en: "Intermediate" },
      { id: "4-3", title: "بلوتوث کلاسیک و BLE با گوشی", min: 60, level: "متوسط", title_en: "Bluetooth Classic and BLE with your phone", level_en: "Intermediate" }
    ]},
    { n: 5, title: "اینترنت اشیا و پروژه‌های پیشرفته", title_en: "IoT and advanced projects", color: "#d6457a", lessons: [
      { id: "5-1", title: "پروتکل MQTT با HiveMQ و Adafruit IO", min: 60, level: "پیشرفته", title_en: "MQTT with HiveMQ and Adafruit IO", level_en: "Advanced" },
      { id: "5-2", title: "ESP-NOW: ارتباط مستقیم دو ESP32 بدون مودم", min: 50, level: "پیشرفته", title_en: "ESP-NOW: two ESP32s talking without a router", level_en: "Advanced" },
      { id: "5-3", title: "ESP32-CAM: پخش زنده تصویر و ذخیره عکس روی کارت SD", min: 65, level: "پیشرفته", title_en: "ESP32-CAM: live video and photos to an SD card", level_en: "Advanced" },
      { id: "5-4", title: "FreeRTOS: چند کار هم‌زمان، صف و نگهبان (Watchdog)", min: 55, level: "پیشرفته", title_en: "FreeRTOS: tasks, queues and the watchdog", level_en: "Advanced" },
      { id: "5-5", title: "آپدیت بی‌سیم OTA و فایل‌سیستم LittleFS", min: 50, level: "پیشرفته", title_en: "OTA updates and LittleFS", level_en: "Advanced" },
      { id: "5-6", title: "API وب، HTTPS و دستگاهی که ماه‌ها کار کند", min: 60, level: "پیشرفته", title_en: "Web APIs, HTTPS and a device that runs for months", level_en: "Advanced" }
    ]},
    { n: 6, title: "مدیریت انرژی، هوش مصنوعی و پروژه نهایی", title_en: "Power, AI and the final project", color: "#0f8fa8", lessons: [
      { id: "6-1", title: "خواب عمیق و خواب سبک برای دستگاه‌های باتری‌خور", min: 50, level: "پیشرفته", title_en: "Deep sleep and light sleep for battery devices", level_en: "Advanced" },
      { id: "6-2", title: "برنامه‌نویسی با کمک هوش مصنوعی: Claude و ChatGPT", min: 45, level: "همه سطوح", title_en: "Programming with AI help: Claude and ChatGPT", level_en: "All levels" },
      { id: "6-3", title: "پروژه نهایی: ایستگاه پایش محیط با هشدار ابری", min: 90, level: "پیشرفته", title_en: "Final project: environment monitor with cloud alerts", level_en: "Advanced" },
      { id: "6-4", title: "حالا نوبت توست: هر پروژه با هر مدل ESP32", min: 70, level: "همه سطوح", title_en: "Your turn: any project on any ESP32", level_en: "All levels" }
    ]}
  ],
  extras: [
    { id: "index", title: "خانه و نقشه راه", title_en: "Home & roadmap" },
    { id: "pinout", title: "نقشه پایه‌های تعاملی", title_en: "Interactive pinout" },
    { id: "glossary", title: "واژه‌نامه", title_en: "Glossary" },
    { id: "troubleshooting", title: "عیب‌یابی: همه مشکل‌ها یک‌جا", title_en: "Troubleshooting: all problems" },
    { id: "tools", title: "جعبه‌ابزار", title_en: "Toolbox" },
    { id: "cheatsheet", title: "برگه خلاصه قابل چاپ", title_en: "Printable cheat sheet" },
    { id: "credits", title: "منابع و مجوز تصاویر", title_en: "Sources & image licenses" }
  ]
};
