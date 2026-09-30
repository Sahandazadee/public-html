#include <stdio.h>
#include <stdint.h>

static uint32_t ticks_lo = 0xFFFFFFFFu;   // نیمهٔ پایین شمارنده
static uint32_t ticks_hi = 0x00000000u;   // نیمهٔ بالا

static void fake_irq(void)                // وقفه: شمارنده را یکی زیاد می‌کند
{
    ticks_lo++;
    if (ticks_lo == 0u) {
        ticks_hi++;
    }
}

int main(void)
{
    uint32_t lo = ticks_lo;               // main نیمهٔ پایین را می‌خواند
    fake_irq();                           // وقفه دقیقا همین‌جا می‌آید
    uint32_t hi = ticks_hi;               // main نیمهٔ بالا را می‌خواند

    printf("torn read : 0x%08x%08x\n", (unsigned)hi, (unsigned)lo);
    printf("real value: 0x%08x%08x\n", (unsigned)ticks_hi, (unsigned)ticks_lo);
    return 0;
}
