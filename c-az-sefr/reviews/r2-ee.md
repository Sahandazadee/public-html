# ریویوی دور ۲ — شاگرد مجازی «مهندس برق» (r2-ee)

پروفایل: دانشجوی کارشناسی برق، آردوینو بلد، می‌خواهد روی Nucleo-F411RE و ESP32 DevKit واقعی فلش کند.
دامنه: درس‌های ۵.۱ تا ۵.۷، و بخش‌های سخت‌افزاری ۶.۱، ۶.۵، ۷.۱. روش: متن هر درس با اسکریپت استخراج شد (SVG حذف)، همهٔ پروژه‌های `code/` با arm-none-eabi-gcc 13.2.1 و gcc ساخته شد، و خروجی‌های `objdump/nm/size/map` با آنچه روی صفحه چاپ شده سنجیده شد. هیچ درسی ویرایش نشد و commit نشد. (گزارش بعد از هر درس ذخیره می‌شود.)

---

## درس ۵.۱ — بوت شدن میکروکنترلر

**نتیجهٔ بازبینی دور ۱:** مورد حاد دور ۱ (جدول ناقص) رفع شده است. `code/5-1/vectors.c` اکنون ۱۰۲ کلمه دارد (۱۶ هسته + ۸۶ وقفه، ۶۶ اعلان weak = ۹ هسته + ۵۷ تراشه) و با `code/5-1/boot/vectors.c` یکسان است.

**تطبیق خروجی‌ها (ساخته و مقایسه شد، همه یکی بود):**
- `objdump -h`: `.isr_vector` 0x198 در 0x08000000؛ `.text` 0xCC؛ `.rodata` 0x10؛ `.data` VMA 0x20000000 / LMA 0x08000274؛ `.bss` 8 — عینا مثل صفحه.
- `size`: text=628 data=4 bss=8 ✓. `nm -n`: Reset_Handler 080001ac، SysTick_Handler 08000210، _sidata 08000274، _estack 20020000 ✓.
- `objdump -s`: کلمهٔ ۰ = 0x20020000، کلمهٔ ۱ = 0x080001AD، ورودی ۱۵ (0x3C) = 0x08000211، ورودی ۵۴ (0xD8) = 0x08000199 (Default)، ورودی ۵۶ (0xE0) در ex3 = 0x08000211 ✓.
- literal pool پنج کلمه ✓. خطای `-O2` بدون -ffreestanding (memcpy/memset)، خطای zero.c با memcpy، لینک موفق با libc_min.c، خطای ASSERT برای آرایهٔ ۱۲۷K، و جدول size برای `buf_data` (data=1004) و `buf_bss` (bss=1008) همه بازتولید شد و با متن می‌خواند. `bootsim` و `bootsim_bug` نیز.
- نگاشت IRQ: همهٔ ۵۷ شماره (WWDG=0 … USART2=38 → ورودی ۵۴، EXTI15_10=40 → ۵۶، OTG_FS=67، FPU=81، SPI5=85) با RM0383 جدول ۳۷ می‌خواند.

### ۱) جاهایی که گیج شدم
- (جزئی) خروجی خطای ASSERT روی صفحه با پیشوند `ld:` آمده؛ در واقع خروجی با مسیر کامل `/usr/lib/gcc/arm-none-eabi/13.2.1/../../../arm-none-eabi/bin/ld:` شروع می‌شود. شاگرد فکر می‌کند چیزی فرق دارد. **اصلاح:** یک «(مسیر ld کوتاه شده)» کنار خروجی.
- (جزئی) فرمان اصلی ساخت (`... -T stm32f411.ld -o out.elf vectors.c startup.c main.c`) بدون `-Og` است (یعنی -O0) ولی تمرین‌ها و درس‌های بعدی -Og دارند؛ اندازه‌های `size` (628) فقط برای -O0 درست است. **اصلاح:** یک جمله «اعداد این درس با -O0 است؛ با -Og کمی فرق می‌کند».

### ۲) مطلب کم / خطر روی برد واقعی
- (جزئی) در `system_init` شرط `__VFP_FP__ && !__SOFTFP__` برای `-mfloat-abi=softfp` هم درست است؟ روی GCC ARM `__SOFTFP__` برای softfp تعریف نمی‌شود پس CPACR فعال می‌شود؛ درست است. ولی متن فقط از `-mfloat-abi=hard` حرف می‌زند. **اصلاح:** «hard یا softfp».
- (جزئی) «ESP32: ROM → bootloader (0x1000) → partition (0x8000)» درست است ولی گفته نشده که برای **ESP32-S3/C3** آفست bootloader 0x0 است (و DevKit رایج‌تر ESP32 کلاسیک است). یک پاورقی کافی است.

### ۳) کد که کار نکرد
- هیچ. هر ۶ برنامهٔ ARM و ۲ برنامهٔ PC ساخته شد.

### ۴) باگ صفحه
- هیچ.

### ۵) جدول شدت
| مورد | شدت | اصلاح |
|---|---|---|
| پیشوند مسیر ld در خروجی ASSERT | جزئی | یادداشت |
| اعداد size مخصوص -O0 | جزئی | یک جمله |
| softfp در شرط FPU | جزئی | ذکر softfp |
| آفست bootloader برای S3/C3 | جزئی | پاورقی |

---

## درس ۵.۲ — Bare-metal روی STM32: GPIO با رجیستر

**نتیجهٔ بازبینی دور ۱:** مورد حاد (startup چهار‌درایه‌ای) در مسیر درس رفع شده: Makefile صفحه `startup.o vectors.o` را لینک می‌کند و به vectors.c درس ۵.۱ ارجاع می‌دهد. `code/5-2/bare/` همان پروژهٔ صفحه است و `bare/vectors.c` با `code/5-1/vectors.c` بایت‌به‌بایت یکی است.

**تطبیق خروجی‌ها (ساخته شد):** `make` در `bare/` سه برنامه را بی‌هشدار می‌سازد. `size`: blink=564، button=584، toggle=636 (صفحه: 564 ✓). `objdump -h`: `.isr_vector`=0x198، `.text`=0x9c ✓. `objdump -s`: کلمهٔ ۱ = 0x080001f1، Default = 0x08000231، رزرو صفر ✓. `nm`: Reset_Handler=080001f0، Default_Handler=08000230 ✓. `objdump -d delay`: ۹ دستور دقیقا مثل صفحه ✓. `ex2_bug.c` با `-O2`: خروجی اسمبلی (دو `str` پشت‌سرهم) عینا مثل صفحه ✓؛ شمارهٔ خطوط باگ‌ها (۸–۹، ۱۴، ۱۸ و نبودن RCC در ۱۲–۱۴) با فایل واقعی می‌خواند ✓. `bad_offset.c` پیام `static assertion failed: "BSRR offset"` ✓. `bounce.c` خروجی ۱۰/۵/۱ ✓. ex1/ex2_fix/ex3 با -O2 -Wall -Wextra بی‌هشدار.
بررسی سخت‌افزار: آدرس‌ها (RCC_AHB1ENR=0x40023830، GPIOA=0x40020000، BSRR=+0x18، GPIOC=0x40020800، IDR=0x40020810، PUPDR=0x4002080C)، بیت‌های GPIOAEN=0 و GPIOCEN=2، MODER PA5 = بیت‌های ۱۱:۱۰، PC13 = ۲۷:۲۶، ساختار RCC (AHB1ENR در +0x30) و خطر بازنویسی MODER و از دست دادن SWD (PA13/PA14، MODER ریست 0xA8000000) همه درست‌اند. زمان تأخیر (≈۸–۹ چرخه/دور، ۴۰۰۰۰۰ دور ≈ ۰٫۲ ثانیه روی HSI 16 MHz) منطقی است.

### ۱) جاهایی که گیج شدم
- (متوسط) پوشهٔ ریشهٔ `code/5-2/` هنوز یک نسخهٔ **قدیمی** دارد: `startup.c` با جدول چهار‌درایه‌ای (NMI/HardFault)، `Makefile` بدون `vectors.o` و `stm32f4.h` بدون `const` روی IDR. `make` در همان پوشه بدون خطا می‌سازد و `.isr_vector` فقط ۰x10 بایت است (SysTick و بقیه خارج از جدول). شاگردی که فایل‌های ریشه را بردارد (نه `bare/`) دقیقا همان تلهٔ دور ۱ را دوباره می‌گیرد، و صفحه هم نمی‌گوید کدام پوشه درست است (صفحه فقط «code/5-1/boot» را نام می‌برد و `bare/` را نه). **اصلاح:** فایل‌های قدیمی ریشه حذف شوند (یا ریشه = `bare/`) و در صفحه نوشته شود «پروژهٔ کامل: code/5-2/bare/».
- (جزئی) صفحه می‌گوید «دکمه از قبل مقاومت بالاکش خارجی دارد» و همان‌جا می‌گوید شاید فیلتر RC باشد. به شماتیک MB1136 ارجاع بده یا بنویس «بالاکش داخلی را روشن نگه دار؛ ضرر ندارد». فعلا درست و محتاط است.
- (جزئی) در `toggle.c` تأخیر ۳۰۰۰۰ دور (~۱۵ ms) هم‌زمان فقط «پرش‌های» دور بعدی را می‌گیرد؛ در دکمهٔ فرسوده کافی نیست. صفحه خودش گفته «فرض معقول»؛ اشکال ندارد.

### ۲) اصطلاح بدون تعریف
- «CMSIS»، «LL»، «errata» با یک جمله معرفی شدند؛ کافی است. «literal pool» در ۵.۱ آمده بود.

### ۳) کدی که کار نکرد
- هیچ در `bare/`. (فقط مورد پوشهٔ ریشه بالا.)

### ۴) مطلب کم
- (جزئی) هنگام ریختن با drag-and-drop باید گفته شود فایل `.bin` را باید روی درایو NODE_F411RE بکشی نه `.elf` (گفته شده «.bin»؛ خوب). اگر LED چشمک نزد و ST-LINK هنوز با نرم‌افزار قبلی (Mbed) کار می‌کند، بوت‌لودر ST-LINK به‌روز نیاز است — در حد یک پاورقی.
- (جزئی) هیچ اشاره‌ای نیست که پس از `make` با `-Og` هنوز `-O0` و `-Og` اندازه‌ها را عوض می‌کند (۵۶۴ مخصوص همین پرچم است؛ درست ذکر شده).

### ۵) باگ صفحه
- هیچ.

### ۶) جدول شدت
| مورد | شدت | اصلاح |
|---|---|---|
| فایل‌های قدیمی (جدول ۴ درایه، Makefile بدون vectors.o) در ریشهٔ code/5-2 و ابهام کدام پوشه | متوسط | حذف/جایگزینی ریشه با bare و ذکر مسیر در صفحه |
| ادعای بالاکش خارجی Nucleo بدون ارجاع شماتیک | جزئی | ارجاع MB1136 |
| بوت‌لودر ST-LINK قدیمی | جزئی | پاورقی |

---

## درس ۵.۳ — وقفه و ISR (EXTI / SYSCFG / NVIC)

**نتیجهٔ بازبینی دور ۱:** `code/5-3/irq/` کامل است: `vectors.c` یکسان با ۵.۱، `main.c` و `board.h` یکسان با فایل‌های صفحه، Makefile با `vectors.o`.

**تطبیق خروجی‌ها (ساخته شد):** `irq/`: `size`=796/0/8 ✓، `nm`: EXTI15_10_IRQHandler=080001cc، main=080001f8 ✓، `objdump -h`: `.isr_vector` 0x198، `.text` 0x184، `.bss` LMA 0800031c ✓، `objdump -s` در 0x80000e0: `cd010008 19030008 19030008 00000000` ✓ (0x080001cd، Default=0x08000319). `lost` (6/3/6)، `torn` (0x00000001ffffffff)، `storm`، `nvicmath` (جدول چهار سطر) و `c64.c` با ldrd و `ex2_bug3.c` با `-O2` (`cbnz`، `b.n 10`) همه با صفحه می‌خوانند ✓. `crit.c`، `ex2_fix3.c`، `ex3i.c` بی‌هشدار کامپایل شدند.
بررسی سخت‌افزار: RCC_APB2ENR (0x40023844) بیت ۱۴ SYSCFGEN ✓؛ SYSCFG پایه 0x40013800، EXTICR4 در 0x40013814، فیلد خط ۱۳ = بیت‌های ۷..۴، مقدار ۲ = PC ✓؛ EXTI پایه 0x40013C00 (IMR/EMR/RTSR/FTSR/SWIER/PR تا +0x14) ✓؛ NVIC ISER0/1 = 0xE000E100/104، ICER=0xE000E180، ISPR=0xE000E200، ICPR=0xE000E280، IPR=0xE000E400 ✓؛ EXTI15_10 = IRQ 40 = ISER1 بیت ۸ ✓؛ ۴ بیت اولویت (`prio << 4`) ✓؛ پاک‌کردن PR با نوشتن ۱ ✓؛ الگوی `cpsid i; if(!flag) wfi; cpsie i` درست است (wfi با PRIMASK=1 هم روی وقفهٔ معلق بیدار می‌شود).
ESP-IDF v5: `gpio_config_t` با `pin_bit_mask=1ULL<<`، `gpio_install_isr_service(0)`، `gpio_isr_handler_add(gpio, isr, arg)`، `xQueueSendFromISR(q,&v,NULL)`، `IRAM_ATTR`، `xTaskCreate`، `ESP_LOGI` همه با نام و امضای صحیح.

### ۱) جاهایی که گیج شدم
- (متوسط) همان مشکل ۵.۲: ریشهٔ `code/5-3/` (فایل‌های `main.c`, `board.h`, `startup.c`, `Makefile`, `link.ld`) نسخهٔ قدیمی با جدول ۵۷‌درایه‌ای (`vector_table[16+41]`، فقط NMI/HardFault/EXTI15_10) و Makefile بدون `vectors.o` است. روی برد همین یک برنامه کار می‌کند، ولی `size` آن 616 است نه 796 که صفحه چاپ کرده، و `objdump -s` در 0x80000e0 آدرس متفاوتی نشان می‌دهد؛ شاگردی که از ریشه بسازد خروجی‌اش با هیچ‌یک از اعداد صفحه نمی‌خواند. **اصلاح:** حذف فایل‌های قدیمی ریشه یا انتقال `irq/` به ریشه، و نوشتن مسیر `code/5-3/irq/` در صفحه (متن می‌گوید فقط «vectors.c را از ۵.۱ بردار»).
- (جزئی) پس از `EXTI->PR = 1u << 13;` در ISR روی Cortex-M4 ممکن است به‌خاطر write-buffer ISR دوباره وارد شود (متن خودش در «نکتهٔ ریز» این را گفته). در کد اصلی ISR هیچ خواندن برگشتی (`(void)EXTI->PR;`) گذاشته نشده؛ چون ISR دیگر کار مهمی ندارد (`IMR &= ~` بعدش هست) خطر عملی ناچیز است. فقط یادآوری برای تمرین ۲ (ISR بلند).
- (جزئی) در `main.c` تابع `wait_until_released` main را بلاک می‌کند؛ متن صریحا اعتراف کرده و ارجاع به ۵.۴ داده. خوب.

### ۲) اصطلاح بدون تعریف
- «EXC_RETURN»، «AAPCS» و «PRIGROUP» با یک جمله آمدند؛ کافی. «tail-chaining» ذکر نشده، لازم نیست.

### ۳) کدی که کار نکرد
- هیچ. ۴ برنامهٔ PC و ۵ فایل ARM درست ساخته و اجرا شدند.

### ۴) مطلب کم
- (جزئی) ESP32: هشدار نیست که GPIO0 در بوت strapping است (فشردن هنگام reset وارد حالت دانلود می‌کند)، و روی بعضی DevKitها مقاومت بالاکش خارجی دارد؛ `GPIO_PULLUP_ENABLE` ضرری ندارد. یک جملهٔ کمکی کافی است.
- (جزئی) `(void *)BUTTON_GPIO` روی ESP32 (۳۲ بیتی) درست است، ولی cast یک `enum` به pointer روی بعضی کامپایلرها هشدار می‌دهد؛ بهتر: `(void *)(uintptr_t)BUTTON_GPIO`.

### ۵) باگ صفحه
- هیچ.

### ۶) جدول شدت
| مورد | شدت | اصلاح |
|---|---|---|
| ریشهٔ code/5-3 قدیمی؛ اعداد size (616 در برابر 796) و آدرس جدول با صفحه نمی‌خواند | متوسط | حذف ریشه/انتقال irq و ذکر مسیر |
| نبود read-back بعد از پاک‌کردن PR (فقط تذکر) | جزئی | `(void)EXTI->PR;` |
| strapping GPIO0 در ESP32 | جزئی | یک جمله |
| `(void*)enum` | جزئی | `(uintptr_t)` |

---

## درس ۵.۴ — تایمر، SysTick و PWM (SysTick ۱ms، TIM2)

**نتیجهٔ بازبینی دور ۱:** مورد حاد دور ۱ (SysTick با جدول ۴ درایه‌ای) رفع شد: `code/5-4/stm32t/` با `vectors.c` (یکسان با ۵.۱)، `startup.c` و `link.ld` (یکسان با `5-2/bare`) ساخته می‌شود. مورد «کلاک تایمر ×۲ پس از PLL» نیز در متن آمده (۱۰۰ MHz CPU، APB1=÷۲ ← کلاک TIM2=۱۰۰ MHz) و درست است.

**تطبیق خروجی‌ها (ساخته شد):** `make` در `stm32t/` بی‌هشدار. `nm`: SysTick_Handler=080001f4، Reset_Handler=08000228، Default_Handler=08000268 ✓. `objdump -s`: کلمهٔ ورودی ۱۵ = `f5010008` = 0x080001f5 ✓، بقیه 0x08000269 ✓. `size`: blink_ms=620/0/4، breathe=728/0/4 ✓. ده برنامهٔ PC (`tick_sim`, `wrap`, `timeout`, `sched`, `drift`, `pwm_sim`, `load_calc`, `wait_bug`, `wait_fix`, `pwm_calc`) همه با خروجی چاپ‌شدهٔ صفحه یکی بودند.
بررسی سخت‌افزار: SysTick CTRL/LOAD/VAL=0xE000E010/14/18، CTRL=7، LOAD=15999 برای ۱ms، حداکثر ۲۴ بیت ✓؛ TIM2 پایه 0x40000000 (APB1)، RCC_APB1ENR=0x40023840 بیت ۰، آفست‌های EGR=0x14، CCMR1=0x18، CCER=0x20، PSC=0x28، ARR=0x2C، CCR1=0x34 ✓؛ PA5 = TIM2_CH1 = AF1 در AFRL بیت‌های ۲۳..۲۰ ✓؛ OC1M=110، OC1PE بیت ۳، CC1E بیت ۰، UG بیت ۰، CEN بیت ۰ ✓؛ ترتیب ساعت←AF←PSC/ARR←CCMR1←CCER←EGR←CR1 روی برد واقعی کار می‌کند (روی PA5/LD2 فعال-بالا). PSC=15، ARR=999، CCR1=250 ← ۱kHz/۲۵٪ ✓؛ سروو ARR=19999 CCR1=1500 ✓.
ESP-IDF v5: `esp_timer_get_time()` (int64 µs)، `esp_timer_create(&args,&h)`، `esp_timer_start_periodic(h, us)`، `esp_timer_create_args_t{.callback,.arg,.name}`، `vTaskDelay(pdMS_TO_TICKS())`، `vTaskDelayUntil(&last, ticks)` (در v5 هنوز موجود)، `ledc_timer_config_t` و `ledc_channel_config_t`، `ledc_set_duty`/`ledc_update_duty`، `CONFIG_FREERTOS_HZ`=۱۰۰ پیش‌فرض ✓.

### ۱) جاهایی که گیج شدم
- (جزئی) ESP32 LEDC: در `ledc_channel_config_t` فیلد `.intr_type = LEDC_INTR_DISABLE` ننوشته شده؛ صفر هم همان `LEDC_INTR_DISABLE` است ولی چون ساختار به‌صورت designated-initializer و ناقص است، با `-Wmissing-field-initializers` هشدار می‌دهد. **اصلاح:** یک فیلد `.intr_type = LEDC_INTR_DISABLE` اضافه شود.
- (جزئی) در LEDC با `.duty_resolution = LEDC_TIMER_10_BIT` بیشینهٔ duty برابر 1023 است (نه 1024). در متن «۱۰۲۴ سطح» نوشته شده که درست است، ولی `pwm_set(1024)` روی ESP32 دور می‌زند (۰٪). یک جمله هشدار کافی است.
- (جزئی) `pdMS_TO_TICKS(500)` و `esp_timer`: توضیح داده شده «callback در task مخصوص»؛ در v5 پیش‌فرض همین است (`CONFIG_ESP_TIMER_TASK`)؛ درست.

### ۲) اصطلاح بدون تعریف
- «Input Capture» و «SHPR3» اشاره‌وار آمدند؛ برای درس مقدماتی کافی است.

### ۳) کدی که کار نکرد
- هیچ.

### ۴) مطلب کم
- (جزئی) روی برد واقعی پس از روشن‌کردن `TIM2` بدون `ARPE` تغییر ARR فوری اعمال می‌شود؛ برای تمرین ۳ (تغییر ARR/PSC در `pwm_init`) مشکلی نیست.
- (جزئی) خط «۴۰۰۰۰۰ دور ≈ ۰٫۲ ثانیه» در ۵.۲ در برابر millis() — هیچ ناسازگاری نیست.

### ۵) باگ صفحه
- هیچ.

### ۶) جدول شدت
| مورد | شدت | اصلاح |
|---|---|---|
| `.intr_type` در ledc_channel_config_t | جزئی | افزودن فیلد |
| سقف duty = 1023 در LEDC ۱۰ بیتی | جزئی | یک جمله |

---

## درس ۵.۵ — UART، SPI و I2C (USART2 BRR، SPI2 loopback، BME280، ESP-IDF)

**نتیجهٔ بازبینی دور ۱:** مورد حاد دور ۱ (`USART2_IRQHandler` ← Default_Handler) رفع شده است. ترتیب `ctrl_hum` پیش از `ctrl_meas`، انتظار اندازه‌گیری (`bme_wait_ready`) و نمونهٔ SPI واقعی (SPI2) اضافه شده‌اند.

**تطبیق خروجی‌ها (ساخته شد):** `stm32u/`: `uart_poll.elf`=720/0/0 و `uart_irq_echo.elf`=852/0/72. `nm`: `USART2_IRQHandler`=0800027c، `Default_Handler`=0800033c ✓. `objdump -s | grep 80000d0`: برنامهٔ وقفه‌ای `3d030008 3d030008 7d020008 00000000` (ورودی ۵۴ = 0x0800027d) و برنامهٔ polling `b9020008 ×۳` ✓ — عینا مثل صفحه. `stm32spi/` ساخته شد (`spi_loop.elf`=1000 بایت). `sensor/`: خروجی کامل شامل `temp raw: OK, 519888 (0x7EED0)`، `busy sensor, wait: timeout`، `0x77: no ACK` ✓ با صفحه یکی است. `uart_frame`، `uart_baud` (BRR=139=0x8B، خطا -0.08٪)، `uart_table` (1667/0x683، 139، 17/0x11 با +2.12٪)، `spi_sim`، `i2c_addr_bug`، `i2c_scan` همه با صفحه می‌خوانند.
بررسی سخت‌افزار (RM0383): USART2 پایه 0x40004400 (SR=+0، DR=+4، BRR=+8، CR1=+0xC)، RCC_APB1ENR بیت ۱۷، PA2/PA3=AF7 در AFRL (بیت‌های ۱۱..۸ و ۱۵..۱۲)، SR ریست = 0xC0، RXNE=بیت ۵، TC=بیت ۶، TXE=بیت ۷، ORE=بیت ۳ و پاک‌شدن با «خواندن SR سپس DR»، RXNEIE=بیت ۵ در CR1، IRQ=38 (ISER1 بیت ۶) ✓. **BRR=0x8B در ۱۶ MHz/۱۱۵۲۰۰ درست است** (16e6/115200=138.89 ← 139). SPI2: پایه 0x40003800 (CR1/SR/DR در +0/+8/+0xC)، RCC_APB1ENR بیت ۱۴، PB13=SCK، PB14=MISO، PB15=MOSI همگی AF5، AFRH `0x55500000` (بیت‌های ۳۱..۲۰)، MODER `0xA9000000` (PB12 خروجی، PB13..15 AF)، BR=3 ← ÷۱۶ ← ۱ MHz، SSM+SSI+MSTR، SPE آخر، BSY قبل از CS بالا ✓. توجیه حذف SPI1 (PA5=LD2) درست است. BME280: ID=0xD0→0x60، ctrl_hum=0xF2، status=0xF3 (بیت ۳ measuring)، ctrl_meas=0xF4، temp=0xFA..FC (۲۰ بیت)، skipped=0x80000، آدرس 0x76/0x77 با SDO، `0x25` = osrs_t=1، osrs_p=1، forced ✓، و **ترتیب ctrl_hum سپس ctrl_meas درست است** (ctrl_hum فقط پس از نوشتن ctrl_meas اعمال می‌شود).
ESP-IDF v5: `uart_config_t` با `.source_clk = UART_SCLK_DEFAULT`، `uart_param_config`، `uart_set_pin(port, tx, rx, rts, cts)`، `uart_driver_install(port, rx, tx, qsize, queue, flags)`، `uart_write_bytes`، `uart_read_bytes(..., ticks)`؛ `i2c_param_config`/`i2c_driver_install`/`i2c_master_write_read_device`؛ `spi_bus_initialize(host,&cfg,SPI_DMA_CH_AUTO)`، `spi_bus_add_device`، `spi_device_transmit` همه نام و امضای درست دارند.

### ۱) جاهایی که گیج شدم
- (متوسط) ریشهٔ `code/5-5/` نسخهٔ **قدیمی و ناسازگار** دارد: `make` در ریشه شکست می‌خورد (`ld: cannot open output file sensor: Is a directory` چون زیرپوشه‌ای به نام `sensor/` هست)، `bme.c` ریشه نسخهٔ قدیمی است (`bme_init` بدون `delay_ms = NULL`، نبود `write_reg` و ترتیب ctrl)، و `uart.c/uart_irq.c/uart_main.c` ریشه بدون Makefile و بدون پروژهٔ کامل‌اند. شاگرد نمی‌داند کدام پوشه معتبر است (متن می‌گوید «با make ساخته شد» ولی مسیر را نمی‌دهد). **اصلاح:** حذف فایل‌های تکراری ریشه، فقط `sensor/`، `stm32u/`، `stm32spi/` بمانند و در صفحه مسیرها نوشته شود.
- (جزئی) SPI2 روی Nucleo-F411RE: PB12..PB15 روی هدر **Morpho** (CN10) هستند نه هدر Arduino؛ صفحه شماره‌پین Morpho را نمی‌گوید (CN10: PB12=pin16، PB13=pin30، PB14=pin28، PB15=pin26). شاگرد برق که سیم می‌خواهد وصل کند باید بداند کجا. **اصلاح:** یک جمله «روی کانکتور Morpho سمت CN10 اند» و ذکر پایه‌ها.
- (جزئی) ESP32: `SPI2_HOST` با پایه‌های 23/19/18/5 داده شده؛ این پایه‌ها پایه‌های IOMUX مستقیم **VSPI (SPI3_HOST)** هستند و روی SPI2_HOST (HSPI، پایه‌های 14/12/13/15) از ماتریس GPIO رد می‌شوند (کار می‌کند ولی برای ۱ MHz مهم نیست). متن ماتریس GPIO را گفته؛ فقط برای سازگاری با ESP32-DevKit رایج بهتر است `SPI3_HOST` یا پایه‌های 13/12/14/15 بیاید.

### ۲) اصطلاح بدون تعریف
- «OVER8» بدون تعریف در تمرین ۱ (جزئی). «Morpho» تعریف نشده.

### ۳) کدی که کار نکرد
- هیچ در پوشه‌های معتبر؛ فقط `make` ریشه (بالا).

### ۴) مطلب کم
- (جزئی) `bme_wait_ready` بلافاصله پس از نوشتن `0xF4` فقط status را می‌خواند. در BME280 واقعی بیت `measuring` معمولا لحظهٔ بعد از نوشتن ۱ می‌شود؛ خواندن در همان میکروثانیه‌های اول ممکن است ۰ بدهد و داده قدیمی/۰x80000 برگردد. **اصلاح:** `delay_ms(2)` قبل از polling یا بررسی `BME_ERR_NODATA` (که درایور دارد) و جملهٔ یادداشت.
- (جزئی) برای ESP32 I2C: روی ESP-IDF ≥ 5.3 هدر قدیمی `driver/i2c.h` هشدار deprecation می‌دهد؛ متن گفته نام‌ها فرق می‌کند. کافی.
- (جزئی) ESP32 UART_NUM_1 با TX=17/RX=16: این‌ها پایه‌های پیش‌فرض UART2‌اند؛ بی‌اشکال ولی ممکن است کاربر UART_NUM_2 را هم انتظار داشته باشد.

### ۵) باگ صفحه
- هیچ.

### ۶) جدول شدت
| مورد | شدت | اصلاح |
|---|---|---|
| ریشهٔ code/5-5 قدیمی؛ `make` در ریشه خطا می‌دهد؛ ابهام مسیر | متوسط | حذف تکراری‌ها و ذکر مسیر |
| پایه‌های SPI2 روی Morpho بدون شمارهٔ پین | جزئی | یک جمله + پین‌ها |
| SPI2_HOST با پایه‌های VSPI در ESP32 | جزئی | SPI3_HOST یا پایه‌های HSPI |
| polling status بلافاصله پس از forced trigger | جزئی | تأخیر کوتاه قبل از polling |

---

## درس ۵.۶ — ESP32 با ESP-IDF و FreeRTOS

**نتیجهٔ بازبینی دور ۱:** بخش «قبل از شروع: آماده‌سازی ESP-IDF و برد» اضافه شده (install.sh، export.sh، درایور USB، نام درگاه، دکمهٔ BOOT)؛ ایراد دور ۱ رفع شده.

**تطبیق خروجی‌ها (ساخته شد):** `tick_round` (0/30/990/1500)، `queue_copy`، `mini_rtos` (۶ تیک بیکار از ۱۳)، `starve` (hog=12، blink=0)، `starve_fix` (3/3) و `tick_ceil` همه با خروجی چاپ‌شدهٔ صفحه یکی‌اند. کدهای ESP-IDF قابل ساخت در این محیط نیستند (متن هم همین را می‌گوید)؛ نام‌ها را با ESP-IDF v5 سنجیدم.
ESP-IDF v5 (مطمئن): `idf_component_register(SRCS ... INCLUDE_DIRS ...)`، `include($ENV{IDF_PATH}/tools/cmake/project.cmake)`، `idf.py set-target/build/flash monitor/menuconfig`، `gpio_config_t` (`pin_bit_mask`/`mode`/`pull_up_en`/`pull_down_en`/`intr_type`)، `gpio_set_level`، `ESP_ERROR_CHECK`، `ESP_LOGI/W/E`، `xTaskCreate` (stack بر حسب **بایت** در ESP-IDF ✓)، `xTaskCreatePinnedToCore(fn,name,stack,arg,prio,handle,core)`، `xQueueCreate/xQueueSend/xQueueReceive/xQueueSendFromISR(q,&v,&woken)`، `portYIELD_FROM_ISR(woken)`، `xSemaphoreCreateMutex/Take/Give`، `vTaskDelayUntil(&last,ticks)`، `portMAX_DELAY`، `CONFIG_FREERTOS_HZ`=۱۰۰ پیش‌فرض و اولویت‌ها ۰..۲۴ ✓. زنجیرهٔ ۱۰۰ هرتز و `pdMS_TO_TICKS(5)=0` درست است.

### ۱) جاهایی که گیج شدم
- (جزئی) جملهٔ «task اصلی (app_main) معمولا اولویت ۱ دارد» درست است (`CONFIG_ESP_MAIN_TASK_AFFINITY`...) ولی در جدول، task های مثال با اولویت ۵ و ۱۰ ساخته می‌شوند؛ کسی که `ESP_LOGI` را در app_main و task هم‌زمان ببیند ترتیب را اشتباه می‌فهمد. بی‌اهمیت.
- (جزئی) متن «Task watchdog got triggered» برای هستهٔ idle درست است؛ ولی اگر hog روی **هستهٔ دیگری** باشد idle همان هسته اجرا می‌شود و WDT نمی‌خورد (در ESP32 دو هسته‌ای). صفحه خودش «دو هسته» را جدا توضیح داده؛ یک جمله ربط بدهید.

### ۲) اصطلاح بدون تعریف
- «strapping» در ۵.۳/۵.۶ تکرار شده و با یک جمله توضیح داده شده؛ کافی.

### ۳) کدی که کار نکرد
- هیچ.

### ۴) مطلب کم
- (جزئی) هیچ راهنمایی نیست که روی ESP32 DevKitC (نسخهٔ رسمی) LED کاربر ندارد و GPIO2 لزوما LED نیست؛ متن گفته «برد تو ممکن است فرق کند»؛ کافی.
- (جزئی) `idf.py -p /dev/ttyUSB0 flash monitor` روی لینوکس نیاز به گروه `dialout` دارد؛ در متن آمده ✓.

### ۵) باگ صفحه
- هیچ.

### ۶) جدول شدت
| مورد | شدت | اصلاح |
|---|---|---|
| ارتباط WDT با idle هر هسته | جزئی | یک جمله |
| ترتیب اولویت app_main در مثال | جزئی | — |

---

## درس ۵.۷ — معماری لایه‌ای درایور و HAL (قرارداد init_input / init_output)

**نتیجهٔ بازبینی دور ۱:** قرارداد HAL اکنون چهار تابع دارد (`init_output(pin, initial)`، `init_input(pin, pull)`، `write`، `read`) و هم در `layered/` (mock) و هم `stm32/` (backend رجیستر) و هم صفحهٔ ESP32 پیاده شده؛ مورد «read روی ESP32» با `GPIO_MODE_INPUT_OUTPUT` رفع شده؛ `init_output` سطح اولیه را قبل از MODER می‌نویسد (بدون گلیچ). ایرادهای متوسط دور ۱ (`init_input`، `read()` ESP32) رفع‌اند.

**تطبیق خروجی‌ها (ساخته شد):** `layered/`: `make` هر دو هدف (gcc و `led_arm.o`) بی‌هشدار؛ خروجی `./app` خط‌به‌خط مثل صفحه (`led_off on broken bus -> 2`، `led_init on pin 99 -> 1`، `total writes: 4`) ✓؛ `led_arm.o`=360 ✓. `stm32/`: `make` کامل؛ `board.elf` = 992/0/0 ✓، `nm`: main=080001b8، led_init=08000214، Reset_Handler=0800038c، hal_gpio_stm32_ops=080003d0 ✓، کلمهٔ ۱ جدول = 0x0800038d ✓، `objdump -t`: `hal_gpio_stm32_ops` در `.rodata` با اندازهٔ 0x10 ✓. `vectors.c` و `startup.c` پوشهٔ `stm32/` با ۵.۱ و `5-2/bare` یکسان‌اند. اندازهٔ ‌`hal_gpio_stm32.o`=548 و `main_board.o`=104 مربوط به ساخت بدون بهینه‌سازی (-O0) است (با -Og: 292 و 80) ✓ با «بدون بهینه‌سازی» در متن. `count_backend`, `polarity_bug/fix`, `pin_math` همه یکی بودند.
بررسی سخت‌افزار backend STM32: `GPIO_BASE = 0x40020000 + 0x400×port`، MODER/PUPDR/IDR/BSRR در +0/+0xC/+0x10/+0x18، ساعت RCC_AHB1ENR بیت `port` (برای ورودی هم)، ترتیب BSRR ← MODER در `init_output`، ماسک `~(3u<<2n)` و PUPDR (۰۱ بالاکش، ۱۰ پایین‌کش)، GPIOH در 0x40021C00 (پورت ۷) ✓. روی Nucleo واقعی: PA5 خروجی، PC13 با `init_input(HAL_PULL_UP)` درست می‌خواند.
ESP-IDF v5: `gpio_reset_pin`, `gpio_set_level(gpio_num_t, uint32_t)`, `gpio_set_direction(…, GPIO_MODE_INPUT_OUTPUT)`, `gpio_set_pull_mode(…, GPIO_PULLUP_ONLY/GPIO_PULLDOWN_ONLY/GPIO_FLOATING)`, `gpio_get_level`, ماکروهای `GPIO_IS_VALID_GPIO` و `GPIO_IS_VALID_OUTPUT_GPIO` ✓.

### ۱) جاهایی که گیج شدم
- (متوسط) فایل‌های ریشهٔ `code/5-7/` (`hal_gpio.h`، `hal_gpio_stm32.c`، `main.c`، …) نسخهٔ **قدیمی** قرارداد را دارند: فقط سه تابع (`init_output(pin)` بدون سطح اولیه و **بدون `init_input`**)، backend STM32 قدیمی، و `main.c` بدون بخش LED دوم/دکمه. `make` در ریشه می‌سازد ولی `./app` خروجی متفاوت با صفحه می‌دهد و backend STM32 ریشه نمی‌تواند دکمهٔ PC13 را بخواند. همان الگوی ریشه‌های قدیمی ۵.۲/۵.۳/۵.۵. **اصلاح:** حذف فایل‌های ریشه و نگه‌داشتن `layered/` و `stm32/` (یا کپی آن‌ها به ریشه) و نوشتن مسیر در صفحه.
- (جزئی) ناسازگاری عددی: متن در دو جا «۱۲ بایت» می‌گوید (جدول مقایسه: «یک پرش غیرمستقیم + ۱۲ بایت جدول»، و پاسخ آزمون: «۱۲ بایت RAM») ولی با چهار اشاره‌گر هر ۴ بایت و `objdump -t` همان صفحه، اندازه ۱۶ بایت (0x10) است. **اصلاح:** هر دو ← ۱۶ بایت.
- (جزئی) `bad_sig.c`: خروجی چاپ‌شدهٔ صفحه `error ... [-Werror=incompatible-pointer-types]` است؛ با gcc 13 و فرمان معمولی `-Wall -Wextra` فقط **warning** می‌گیری (تست کردم). متن همین را در پاراگراف بعد می‌گوید؛ ولی فرمان بالای خروجی `-Werror=incompatible-pointer-types` را ندارد. **اصلاح:** فرمان کامل کنار خروجی نوشته شود.

### ۲) اصطلاح بدون تعریف
- «BSP»، «vtable»، «وارونگی وابستگی» همه با جمله‌ای تعریف شده‌اند؛ کافی.

### ۳) کدی که کار نکرد (احتمال خرابی روی برد)
- (جزئی) ESP32: `GPIO_IS_VALID_OUTPUT_GPIO` پایه‌های 6..11 (متصل به Flash SPI) را **معتبر** می‌داند؛ `init_output(6)` برد را قفل/ریست می‌کند. متن فقط 20/24/28..31 و 34..39 را می‌گوید. **اصلاح:** یک سطر «پایه‌های ۶ تا ۱۱ روی ESP32 کلاسیک به Flash وصل‌اند؛ در backend ردشان کن».
- (جزئی) `gpio_reset_pin` در ESP-IDF v5 پایه را «جدا از جهت» و با **pull-up فعال** برمی‌گرداند؛ پس برای چند میکروثانیه قبل از `gpio_set_direction` پایه از راه pull-up بالا می‌ماند و بالاکش پس از خروجی‌شدن هم روشن می‌ماند. ادعای «بدون گلیچ» برای `initial = LOW` روی پایهٔ مثل CS-فعال-بالا دقیق نیست (گلیچ ضعیف ~۴۵kΩ). **اصلاح:** `gpio_set_pull_mode(g, GPIO_FLOATING)` پیش از جهت، و در متن «تقریبا بدون گلیچ».

### ۴) مطلب کم
- (جزئی) backend STM32 برای PA13/PA14 (SWD) و PB3/PB4 (JTAG) هشدار ندارد؛ `init_output(HAL_PIN('A',13))` همان تلهٔ ۵.۲ را می‌سازد. یک سطر هشدار کافی است.

### ۵) باگ صفحه
- هیچ (متن `data-why` یک گزینهٔ آزمون شامل کاراکتر `<code>` است و در مرورگر سالم است).

### ۶) جدول شدت
| مورد | شدت | اصلاح |
|---|---|---|
| ریشهٔ code/5-7 با قرارداد قدیمی (بدون init_input) | متوسط | حذف/انتقال و ذکر مسیر |
| «۱۲ بایت» در برابر ۱۶ بایت | جزئی | اصلاح عدد |
| فرمان -Werror برای bad_sig | جزئی | نوشتن فرمان |
| GPIO6..11 در ESP32 | جزئی | رد در backend + سطر |
| gpio_reset_pin و pull-up (ادعای بدون گلیچ) | جزئی | FLOATING + تعدیل متن |
| PA13/PA14 در backend STM32 | جزئی | هشدار |

---

## درس ۶.۱ — دیباگ (بخش‌های سخت‌افزاری: HardFault، SWD/OpenOCD، پایهٔ دیباگ، رنگ‌آمیزی پشته)

**نتیجهٔ بازبینی دور ۱:** مورد «HardFault_Handler weak» با جدول کامل ۵.۱ سازگار است (نام `HardFault_Handler` در `vectors.c` تعریف weak دارد و `fault.c` تعریف قوی می‌دهد).

**تطبیق خروجی‌ها (ساخته شد):** `fault.c` و `dbgpin.c` با `arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -Wall -Wextra -ffreestanding -c` بی‌هشدار؛ `objdump -d` handler برهنه: `tst.w lr,#4 ; ite eq ; mrseq r0,MSP ; mrsne r0,PSP ; b.w hardfault_c` (همان منطق متن). خط ۴۰ فایل `fault.c` همان `return *(volatile uint32_t *)0xA0000000u;` است (ادعای addr2line ✓). `fault_decode` (۳ خط خروجی)، `stackpaint` (used=20، free=43، intact/SMASHED)، `hfsr` (HFSR=0x40000000: FORCED) با صفحه می‌خوانند ✓.
بررسی سخت‌افزار (ARMv7-M): CFSR=0xE000ED28، HFSR=0xE000ED2C، MMFAR=0xE000ED34، BFAR=0xE000ED38، SHCSR=0xE000ED24 (MEMFAULTENA/BUSFAULTENA/USGFAULTENA = بیت ۱۶/۱۷/۱۸)، CCR=0xE000ED14 (UNALIGN_TRP بیت ۳، DIV_0_TRP بیت ۴) ✓؛ بیت‌های CFSR (IBUSERR=8، PRECISERR=9، IMPRECISERR=10، BFARVALID=15، UNDEFINSTR=16، INVSTATE=17، INVPC=18، NOCP=19، UNALIGNED=24، DIVBYZERO=25) ✓؛ `0x8200` = PRECISERR|BFARVALID ✓؛ بیت ۲ در EXC_RETURN برای انتخاب MSP/PSP ✓؛ قاب ۸ کلمه‌ای با PC در `frame[6]` ✓ (حتی با FPU)؛ ادعای «ناهم‌ترازی LDR/STR روی M4 مجاز است» ✓؛ ۰xA0000000 روی F411 ناحیهٔ رزرو → BusFault دقیق ✓. OpenOCD: `interface/stlink.cfg` + `target/stm32f4x.cfg`، پورت gdb=3333، `monitor reset halt`، `load` ✓ (نام قدیمی `stlink-v2-1.cfg` قبل از ۰٫۱۰ ✓). `DBGMCU` برای فریز تایمرها ✓. ESP32: `xtensa-esp32-elf-addr2line -pfiaC -e build/app.elf` و پیام «Guru Meditation Error ... LoadProhibited» و `EXCVADDR` ✓.

### ۱) جاهایی که گیج شدم
- (متوسط) بخش رنگ‌آمیزی پشته می‌گوید «روی MCU این کار را اول از همه، در startup انجام می‌دهی» و «ناحیهٔ stack در linker script (درس ۵.۱)»؛ ولی اسکریپت لینکر ۵.۱ **هیچ نماد مرز پایین پشته** (`_sstack` یا `_ebss` + اندازه) ندارد — فقط `_estack` و یک `ASSERT` یک کیلوبایتی. شاگرد نمی‌داند از کجا تا کجا را رنگ بزند؛ و اگر در `Reset_Handler` (C) از `_ebss` تا `_estack` را پر کند، **قاب پشتهٔ خود Reset_Handler** را هم پاک می‌کند و برنامه می‌ترکد. **اصلاح:** در لینکر `_sstack = _ebss;` (یا `. = ALIGN(8); _sstack = .;`) بیفزایید، و در متن بنویسید «رنگ‌آمیزی را از `_ebss` تا `SP-16` بکن (با `__asm("mov %0, sp")`) یا در یک تابع naked/اسمبلی پیش از ساخت قاب».
- (جزئی) نمونهٔ HardFault می‌گوید «پس از وصل شدن دیباگر به حلقه می‌رسی»؛ روی Nucleo پس از `load` + `continue` و ایستادن در `for(;;)` باید `Ctrl+C` بزنی. یک جملهٔ GDB (`interrupt`) اضافه شود. همچنین چاپ نمونهٔ `fault_pc = 0x8000064` با اخطار «نمایشی» مشخص شده؛ خوب.
- (جزئی) `.cfg` برای Nucleo-F411RE با ST-LINK V2-1: دستور رایج `openocd -f board/st_nucleo_f4.cfg` هم هست؛ صفحه از دو فایل جدا استفاده می‌کند و درست است.

### ۲) اصطلاح بدون تعریف
- «DAP» و «semihosting» با یک جمله آمده‌اند؛ «escalate» تعریف شده؛ کافی.

### ۳) کدی که کار نکرد
- هیچ. (`hfsr.c` فقط روی PC است و با arm-gcc نیز نباید ساخته شود؛ `stdio.h` ندارد.)

### ۴) مطلب کم
- (جزئی) برای ESP-IDF v5 هیچ ذکری از `CONFIG_ESP_SYSTEM_PANIC` یا `idf.py monitor` رمزگشایی backtrace نیست (فقط یک جمله). خوب است.
- (جزئی) `-fstack-protector` در bare-metal نیازمند `__stack_chk_guard`/`__stack_chk_fail` است؛ متن گفته (بریده شده در استخراج). ✓

### ۵) باگ صفحه
- هیچ.

### ۶) جدول شدت
| مورد | شدت | اصلاح |
|---|---|---|
| نبود `_sstack` در لینکر ۵.۱ و خطر پاک‌کردن قاب Reset_Handler هنگام رنگ‌آمیزی | متوسط | افزودن نماد + ذکر مرز/ترتیب |
| نیاز به `interrupt` در GDB | جزئی | یک جمله |

