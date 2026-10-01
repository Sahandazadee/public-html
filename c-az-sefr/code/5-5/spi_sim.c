#include <stdint.h>
#include <stdio.h>

/* --- سمت slave (شبیه‌سازی): یک رجیستر شیفت هشت‌بیتی --- */
static uint8_t s_shift;                 // آنچه slave می‌فرستد
static uint8_t s_in;                    // آنچه slave دریافت می‌کند
static int s_miso;                      // سیم MISO

static void slave_cs_fall(uint8_t reply)
{
    s_shift = reply;
    s_in = 0u;
    s_miso = (s_shift >> 7) & 1;        // اولین بیت آماده روی MISO
}

static void slave_sck_rise(int mosi)
{
    s_in = (uint8_t)((s_in << 1) | (unsigned)mosi);     // نمونه‌برداری
}

static void slave_sck_fall(void)
{
    s_shift = (uint8_t)(s_shift << 1);
    s_miso = (s_shift >> 7) & 1;        // بیت بعدی را آماده کن
}

/* --- سمت master: حالت ۰ (CPOL=0, CPHA=0)، اول MSB --- */
static uint8_t spi_transfer(uint8_t out)
{
    uint8_t in = 0u;

    printf("clk mosi miso\n");
    for (int i = 7; i >= 0; i--) {
        int mosi = (out >> i) & 1;
        slave_sck_rise(mosi);                           // لبهٔ بالارو: هر دو نمونه می‌گیرند
        in = (uint8_t)((in << 1) | (unsigned)s_miso);
        printf("%3d %4d %4d\n", 7 - i, mosi, s_miso);
        slave_sck_fall();                               // لبهٔ پایین‌رو: بیت بعدی
    }
    return in;
}

int main(void)
{
    slave_cs_fall(0x3Cu);                               // CS پایین: slave آماده است
    uint8_t got = spi_transfer(0xA5u);
    printf("master sent 0xA5, got 0x%02X; slave got 0x%02X\n", got, s_in);
    return 0;
}
