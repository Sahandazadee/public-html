#ifndef HAL_H
#define HAL_H

#include <stdbool.h>
#include <stdint.h>

/* هر سکو (PC، STM32، ESP32) این پنج تابع را می‌دهد؛ منطق برنامه فقط این را می‌شناسد */
typedef struct {
    bool     (*sensor_read)(uint16_t *raw);     /* یک نمونهٔ خام؛ false = خطای سنسور */
    void     (*uart_write)(const char *s);      /* ارسال یک رشته */
    bool     (*uart_getc)(char *c);             /* دریافت یک نویسه بدون انتظار؛ false = چیزی نیست */
    void     (*led_set)(bool on);               /* چراغ آلارم */
    uint32_t (*millis)(void);                   /* میلی‌ثانیه از شروع کار */
} hal_t;

#endif /* HAL_H */
