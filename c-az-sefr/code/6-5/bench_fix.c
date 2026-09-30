#include <stdint.h>

volatile uint32_t n_in = 1000u;         /* ورودی «مرموز» برای کامپایلر */
volatile uint32_t sink;                 /* مقصد «واقعی» نتیجه */

uint32_t work(uint32_t n)
{
    uint32_t x = 0;
    for (uint32_t i = 0; i < n; i++) {
        x += i * i;
    }
    return x;
}

void bench_fix(void)
{
    sink = work(n_in);                  /* ورودی را نمی‌داند و نتیجه را باید بنویسد */
}
