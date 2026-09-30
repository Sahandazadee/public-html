#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint8_t leds = 0x65;
    uint8_t edges = 0x81;

    printf("0x%02X = %d\n", (unsigned)leds, leds);
    printf("0x%02X = %d\n", (unsigned)edges, edges);
    return 0;
}
