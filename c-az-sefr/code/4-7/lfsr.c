#include <stdio.h>
#include <stdint.h>

/* LFSR ۱۶ بیتی نوع Galois با ماسک 0xB400 (چندجمله‌ای بیشینه‌طول) */
static uint16_t lfsr_next(uint16_t s)
{
    uint16_t lsb = s & 1u;
    s >>= 1;
    if (lsb) {
        s ^= 0xB400u;
    }
    return s;
}

int main(void)
{
    const uint16_t seed = 0xACE1u;
    uint16_t s = seed;

    printf("first states:");
    for (int i = 0; i < 5; i++) {
        s = lfsr_next(s);
        printf(" %04X", (unsigned)s);
    }
    printf("\n");

    s = seed;
    unsigned period = 0;
    do {
        s = lfsr_next(s);
        period++;
    } while (s != seed);
    printf("period = %u\n", period);
    return 0;
}
