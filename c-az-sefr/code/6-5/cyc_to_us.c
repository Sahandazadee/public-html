#include <stdio.h>
#include <stdint.h>

static uint32_t cycles_to_us_bad(uint32_t cycles, uint32_t hz)
{
    return cycles * 1000000u / hz;          /* ضرب ۳۲ بیتی: ممکن است سرریز کند */
}

static uint32_t cycles_to_us(uint32_t cycles, uint32_t hz)
{
    return (uint32_t)((uint64_t)cycles * 1000000u / hz);   /* ضرب ۶۴ بیتی: امن */
}

int main(void)
{
    printf("1600 cycles @ 16 MHz  : good %u us, bad %u us\n",
           (unsigned)cycles_to_us(1600u, 16000000u), (unsigned)cycles_to_us_bad(1600u, 16000000u));
    printf("5000 cycles @ 16 MHz  : good %u us, bad %u us\n",
           (unsigned)cycles_to_us(5000u, 16000000u), (unsigned)cycles_to_us_bad(5000u, 16000000u));
    printf("3200 cycles @ 100 MHz : good %u us\n", (unsigned)cycles_to_us(3200u, 100000000u));
    printf("counter wraps after %.1f s @ 16 MHz\n", 4294967296.0 / 16000000.0);
    printf("counter wraps after %.1f s @ 100 MHz\n", 4294967296.0 / 100000000.0);
    return 0;
}
