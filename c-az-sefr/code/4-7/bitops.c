#include <stdio.h>
#include <stdint.h>

static unsigned popcount_loop(uint32_t x)
{
    unsigned n = 0;
    while (x != 0u) {
        x &= x - 1u;            /* پایین‌ترین بیت ۱ را پاک می‌کند */
        n++;
    }
    return n;
}

static uint8_t reverse8(uint8_t x)
{
    uint8_t r = 0;
    for (int i = 0; i < 8; i++) {
        r = (uint8_t)((r << 1) | (x & 1u));
        x >>= 1;
    }
    return r;
}

static int is_pow2(uint32_t x)
{
    return x != 0u && (x & (x - 1u)) == 0u;
}

int main(void)
{
    printf("popcount(0xF0F0) = %u\n", popcount_loop(0xF0F0u));
    printf("popcount(0x80000001) = %u\n", popcount_loop(0x80000001u));
    printf("builtin(0xF0F0) = %d\n", __builtin_popcount(0xF0F0u));
    printf("reverse8(0x01) = 0x%02X\n", (unsigned)reverse8(0x01));
    printf("reverse8(0x2C) = 0x%02X\n", (unsigned)reverse8(0x2C));
    printf("is_pow2: 64->%d 96->%d 0->%d\n", is_pow2(64), is_pow2(96), is_pow2(0));
    return 0;
}
