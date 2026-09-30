#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint8_t x = 22;                     // 00010110

    printf("x      = %3u\n", (unsigned)x);
    printf("x << 1 = %3u\n", (unsigned)(x << 1));
    printf("x << 2 = %3u\n", (unsigned)(x << 2));
    printf("x >> 1 = %3u\n", (unsigned)(x >> 1));
    printf("x >> 2 = %3u\n", (unsigned)(x >> 2));

    uint8_t big = 200;                  // 11001000
    uint8_t shifted = (uint8_t)(big << 1);
    printf("200 << 1 in uint8_t = %u\n", (unsigned)shifted);

    for (unsigned n = 0; n < 8; n++) {
        printf("1U << %u = %3u\n", n, 1U << n);
    }
    return 0;
}
