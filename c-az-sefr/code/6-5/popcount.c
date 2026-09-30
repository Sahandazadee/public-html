#include <stdio.h>
#include <stdint.h>

static unsigned steps;                      /* شمارندهٔ «کار» انجام‌شده */
static uint8_t table[256];                  /* جدول تعداد بیت‌های هر بایت */

static uint8_t pop_loop(uint16_t x)         /* راه ۱: هر ۱۶ بیت را بررسی کن */
{
    uint8_t n = 0;
    for (int i = 0; i < 16; i++) {
        steps++;
        n += (uint8_t)((x >> i) & 1u);
    }
    return n;
}

static uint8_t pop_kern(uint16_t x)         /* راه ۲: فقط به تعداد بیت‌های ۱ دور بزن */
{
    uint8_t n = 0;
    while (x != 0u) {
        steps++;
        x = (uint16_t)(x & (x - 1u));       /* پایین‌ترین بیت ۱ را پاک می‌کند */
        n++;
    }
    return n;
}

static uint8_t pop_table(uint16_t x)        /* راه ۳: دو بار در جدول نگاه کن */
{
    steps += 2u;
    return (uint8_t)(table[x & 0xFFu] + table[x >> 8]);
}

int main(void)
{
    for (unsigned v = 0; v < 256u; v++) {   /* پر کردن جدول (یک‌بار، مثلا در بوت) */
        table[v] = (uint8_t)((v & 1u) + table[v >> 1]);
    }

    unsigned total1 = 0, total2 = 0, total3 = 0;
    unsigned s1, s2, s3;

    steps = 0;
    for (unsigned v = 0; v < 65536u; v++) total1 += pop_loop((uint16_t)v);
    s1 = steps;
    steps = 0;
    for (unsigned v = 0; v < 65536u; v++) total2 += pop_kern((uint16_t)v);
    s2 = steps;
    steps = 0;
    for (unsigned v = 0; v < 65536u; v++) total3 += pop_table((uint16_t)v);
    s3 = steps;

    printf("results equal: %s\n", (total1 == total2 && total2 == total3) ? "yes" : "NO");
    printf("loop : %u steps\n", s1);
    printf("kern : %u steps\n", s2);
    printf("table: %u steps\n", s3);
    return 0;
}
