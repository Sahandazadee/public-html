#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint8_t m = 0x0F;
    printf("~m          = 0x%X\n", (unsigned)~m);
    printf("(uint8_t)~m = 0x%X\n", (unsigned)(uint8_t)~m);
    printf("1U << 31    = %u\n", 1U << 31);
    printf("-8 >> 1     = %d\n", -8 >> 1);

    unsigned long long mask = (1ULL << 2) | (1ULL << 25) | (1ULL << 33);
    printf("mask        = 0x%llX\n", mask);
    return 0;
}
