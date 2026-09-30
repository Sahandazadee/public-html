#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint16_t adc = 930;
    int32_t mv = (int32_t)adc * 3300 / 4095;
    int32_t tenths = mv - 500;

    printf("adc = %d, mv = %d\n", (int)adc, (int)mv);
    printf("temp = %d.%d C\n", (int)(tenths / 10), (int)(tenths % 10));

    tenths = -25;
    printf("negative: %d.%d C\n", (int)(tenths / 10), (int)(tenths % 10));
    return 0;
}
