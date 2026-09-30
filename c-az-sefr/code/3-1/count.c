#include <stdio.h>
#include <stdint.h>

// روش ساده: بیت‌ها را یکی‌یکی بررسی کن
static unsigned count_bits(uint32_t x)
{
    unsigned n = 0;
    while (x != 0) {
        n += x & 1U;        // بیت کم‌ارزش ۱ است؟
        x >>= 1;            // یک جا به راست
    }
    return n;
}

// روش چالش: x & (x - 1) کم‌ارزش‌ترین بیت ۱ را پاک می‌کند
static unsigned count_bits_fast(uint32_t x)
{
    unsigned n = 0;
    while (x != 0) {
        x &= x - 1U;
        n++;
    }
    return n;
}

int main(void)
{
    printf("0xB4       -> %u\n", count_bits(0xB4U));
    printf("0xFFFFFFFF -> %u\n", count_bits(0xFFFFFFFFU));
    printf("0x00000000 -> %u\n", count_bits(0U));
    printf("0xB4 (fast) -> %u\n", count_bits_fast(0xB4U));
    return 0;
}
