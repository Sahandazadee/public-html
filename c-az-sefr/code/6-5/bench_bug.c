#include <stdint.h>

uint32_t work(uint32_t n)
{
    uint32_t x = 0;
    for (uint32_t i = 0; i < n; i++) {
        x += i * i;
    }
    return x;
}

void bench_bug(void)
{
    work(1000u);                /* نتیجه را هیچ‌جا نمی‌گذاریم */
}
