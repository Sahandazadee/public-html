#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint16_t adc = 4095;
    uint32_t good = (uint32_t)adc * 3300U / 4095U;
    uint32_t zero = adc * (3300U / 4095U);
    uint16_t narrow = (uint16_t)(adc * 3300U);

    printf("good   = %u\n", (unsigned)good);
    printf("zero   = %u\n", (unsigned)zero);
    printf("narrow = %u\n", (unsigned)narrow);
    return 0;
}
