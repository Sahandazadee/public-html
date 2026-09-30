#include <stdio.h>
#include <stdint.h>

static uint32_t brr_value(uint32_t clk, uint32_t baud)
{
    return (clk + baud / 2u) / baud;            /* گرد به نزدیک‌ترین (OVER8 = 0) */
}

static void show(uint32_t clk, uint32_t baud)
{
    uint32_t brr = brr_value(clk, baud);
    double actual = (double)clk / (double)brr;
    double err = (actual - (double)baud) * 100.0 / (double)baud;
    printf("clk=%8u baud=%6u BRR=%5u (0x%X) mantissa=%u fraction=%u err=%+.2f%%\n",
           (unsigned)clk, (unsigned)baud, (unsigned)brr, (unsigned)brr,
           (unsigned)(brr >> 4), (unsigned)(brr & 0xFu), err);
}

int main(void)
{
    show(16000000u, 115200u);
    show(16000000u, 9600u);
    show(48000000u, 115200u);
    show(50000000u, 921600u);
    return 0;
}
