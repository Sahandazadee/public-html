#include <stdio.h>
#include <stdint.h>

int main(void)
{
    int8_t plus5 = 5;
    int8_t minus5 = -5;
    int8_t minus1 = -1;

    printf("  5 -> 0x%02X\n", (unsigned)(uint8_t)plus5);
    printf(" -5 -> 0x%02X\n", (unsigned)(uint8_t)minus5);
    printf(" -1 -> 0x%02X\n", (unsigned)(uint8_t)minus1);

    uint8_t x = 5;
    uint8_t y = 0xFB;
    uint8_t sum = (uint8_t)(x + y);
    printf("0x05 + 0xFB = %u\n", (unsigned)sum);

    uint8_t counter = 255;
    counter = (uint8_t)(counter + 1);
    printf("255 + 1 = %u\n", (unsigned)counter);
    return 0;
}
