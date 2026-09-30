#include <stdio.h>
#include <stdint.h>

#ifndef BAUD
#define BAUD 115200U
#endif
#ifndef STALL_MS
#define STALL_MS 5U             // main تا چند میلی‌ثانیه ممکن است گرفتار باشد
#endif

static uint32_t next_pow2(uint32_t n)
{
    uint32_t p = 1U;
    while (p < n) {
        p <<= 1;
    }
    return p;
}

int main(void)
{
    uint32_t bytes_per_s = BAUD / 10U;      // هر بایت روی سیم ۱۰ بیت است
    uint32_t in_stall = (bytes_per_s * STALL_MS + 999U) / 1000U;   // گرد به بالا

    printf("baud=%u -> %u bytes/s\n", (unsigned)BAUD, (unsigned)bytes_per_s);
    printf("stall=%u ms -> %u bytes arrive\n", (unsigned)STALL_MS, (unsigned)in_stall);
    printf("buffer size = %u\n", (unsigned)next_pow2(in_stall));
    return 0;
}
