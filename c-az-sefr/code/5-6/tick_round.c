#include <stdint.h>
#include <stdio.h>

#define HZ 100u                     /* مقدار پیش‌فرض تیک در ESP-IDF */

int main(void)
{
    static const uint32_t want_ms[] = { 5u, 30u, 999u, 1500u };

    for (unsigned i = 0; i < sizeof want_ms / sizeof want_ms[0]; i++) {
        uint32_t ticks = want_ms[i] * HZ / 1000u;   /* مثل pdMS_TO_TICKS */
        uint32_t real_ms = ticks * 1000u / HZ;      /* زمانی که واقعا می‌گذرد */
        printf("want %4u ms -> %3u ticks -> %4u ms\n",
               (unsigned)want_ms[i], (unsigned)ticks, (unsigned)real_ms);
    }
    return 0;
}
