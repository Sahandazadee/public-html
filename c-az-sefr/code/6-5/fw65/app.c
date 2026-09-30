#include <stdint.h>
#include <stddef.h>

#define SENSOR_REG (*(volatile uint32_t *)0x40020010u)  /* GPIOA_IDR؛ اینجا نقش سنسور */
#define OUT_REG    (*(volatile uint32_t *)0x40020014u)  /* GPIOA_ODR؛ اینجا نقش خروجی */

static const uint16_t curve[16] = {         /* جدول ثابت: می‌رود Flash */
    0, 12, 40, 90, 160, 250, 360, 490, 640, 810, 1000, 1210, 1440, 1690, 1960, 2250
};
uint8_t history[64];                        /* بافر تاریخچه: می‌رود .bss */
static uint16_t win[8];                     /* پنجرهٔ میانگین: آن هم .bss */
uint32_t calls = 5;                         /* مقدار اولیهٔ غیرصفر: می‌رود .data */

static uint32_t scale_mv(uint32_t raw)      /* عدد ۱۲ بیتی به میلی‌ولت */
{
    return raw * 3300u / 4095u;
}

static uint32_t average(const uint16_t *a, size_t n)
{
    uint32_t sum = 0;
    for (size_t i = 0; i < n; i++) {
        sum += a[i];
    }
    return sum / n;
}

static uint8_t crc8(const uint8_t *d, size_t n)
{
    uint8_t crc = 0;
    for (size_t i = 0; i < n; i++) {
        crc ^= d[i];
        for (int b = 0; b < 8; b++) {
            crc = (crc & 0x80u) ? (uint8_t)((crc << 1) ^ 0x07u) : (uint8_t)(crc << 1);
        }
    }
    return crc;
}

uint32_t diag_dump(void)                    /* هیچ‌کس صدایش نمی‌زند */
{
    uint32_t s = 0;
    for (size_t i = 0; i < 16; i++) {
        s += curve[i] * (uint32_t)(i + 1u);
    }
    return s;
}

int main(void)
{
    uint32_t k = 0;

    for (;;) {
        win[k & 7u] = (uint16_t)SENSOR_REG;
        k++;
        uint32_t mv = scale_mv(average(win, 8));
        OUT_REG = curve[(mv >> 8) & 15u];
        history[k & 63u] = crc8((const uint8_t *)win, sizeof win);
        calls++;
    }
}
