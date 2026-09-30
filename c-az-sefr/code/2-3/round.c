#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint32_t raw = 2000;
    uint32_t floored = raw * 3300U / 4095U;
    uint32_t rounded = (raw * 3300U + 4095U / 2U) / 4095U;

    printf("exact value  = 1611.72...\n");
    printf("floor result = %u\n", (unsigned)floored);
    printf("round result = %u\n", (unsigned)rounded);
    return 0;
}
