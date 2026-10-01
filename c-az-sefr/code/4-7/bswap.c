#include <stdio.h>
#include <stdint.h>

static uint32_t swap32(uint32_t x)
{
    return  (x << 24)
          | ((x & 0x0000FF00u) << 8)
          | ((x >> 8) & 0x0000FF00u)
          |  (x >> 24);
}

/* خواندن عدد ۱۶ بیتی big-endian از بافر، بدون وابستگی به ماشین */
static uint16_t read_be16(const uint8_t *p)
{
    return (uint16_t)(((uint16_t)p[0] << 8) | p[1]);
}

int main(void)
{
    uint32_t v = 0x12345678u;
    const uint8_t *b = (const uint8_t *)&v;     /* دید بایتی به همان حافظه */

    printf("bytes in memory: %02X %02X %02X %02X\n", (unsigned)b[0], (unsigned)b[1], (unsigned)b[2], (unsigned)b[3]);
    printf("swap32(0x12345678) = 0x%08lX\n", (unsigned long)swap32(v));
    printf("builtin            = 0x%08lX\n", (unsigned long)__builtin_bswap32(v));

    const uint8_t packet[] = { 0x01, 0x90, 0xFF, 0x38 };   /* دو عدد big-endian */
    printf("be16 #0 = %u\n", (unsigned)read_be16(&packet[0]));
    printf("be16 #1 = %u\n", (unsigned)read_be16(&packet[2]));
    return 0;
}
