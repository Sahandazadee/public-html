#include <stdint.h>
#include <stdio.h>

int main(void)
{
    uint32_t f_clk = 16000000u;         // کلاک USART2 (APB1)
    uint32_t baud = 115200u;

    uint32_t brr = (f_clk + baud / 2u) / baud;      // گردکردن به نزدیک‌ترین
    uint32_t actual = f_clk / brr;
    int32_t err = ((int32_t)actual - (int32_t)baud) * 10000 / (int32_t)baud;

    printf("BRR = %u = 0x%X (mantissa %u, fraction %u)\n",
           (unsigned)brr, (unsigned)brr, (unsigned)(brr >> 4), (unsigned)(brr & 0xFu));
    printf("actual baud = %u\n", (unsigned)actual);
    printf("error = %c%d.%02d%%\n", err < 0 ? '-' : '+',
           (int)((err < 0 ? -err : err) / 100), (int)((err < 0 ? -err : err) % 100));
    return 0;
}
