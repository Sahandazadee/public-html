#include <stdint.h>
#include <stdio.h>

int main(void)
{
    uint32_t f_clk = 16000000u;
    uint32_t bauds[] = { 9600u, 115200u, 921600u };

    printf("baud    BRR   hex    actual   error\n");
    for (unsigned i = 0; i < sizeof bauds / sizeof bauds[0]; i++) {
        uint32_t baud = bauds[i];
        uint32_t brr = (f_clk + baud / 2u) / baud;
        uint32_t actual = f_clk / brr;
        int32_t err = ((int32_t)actual - (int32_t)baud) * 10000 / (int32_t)baud;
        int32_t mag = err < 0 ? -err : err;

        printf("%-7u %-5u 0x%-4X %-8u %c%d.%02d%%\n", (unsigned)baud, (unsigned)brr,
               (unsigned)brr, (unsigned)actual, err < 0 ? '-' : '+',
               (int)(mag / 100), (int)(mag % 100));
    }
    return 0;
}
