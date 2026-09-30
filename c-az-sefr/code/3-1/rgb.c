#include <stdio.h>
#include <stdint.h>

static uint16_t pack565(uint8_t r, uint8_t g, uint8_t b)
{
    return (uint16_t)(((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3));
}

int main(void)
{
    uint16_t c = pack565(255, 165, 0);      // نارنجی

    unsigned r5 = (c >> 11) & 0x1FU;
    unsigned g6 = (c >> 5) & 0x3FU;
    unsigned b5 = c & 0x1FU;

    printf("packed = 0x%04X\n", (unsigned)c);
    printf("r5=%u g6=%u b5=%u\n", r5, g6, b5);
    printf("back: r=%u g=%u b=%u\n",
           (r5 << 3) | (r5 >> 2), (g6 << 2) | (g6 >> 4), (b5 << 3) | (b5 >> 2));
    return 0;
}
