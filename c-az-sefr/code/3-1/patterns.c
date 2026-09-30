#include <stdio.h>
#include <stdint.h>

#define BIT(n) (1U << (n))

static void show(uint8_t v)
{
    for (int i = 7; i >= 0; i--) {
        putchar(((v >> i) & 1U) ? '1' : '0');
    }
    printf("\n");
}

int main(void)
{
    uint8_t leds = 0;

    printf("start         "); show(leds);
    leds |= BIT(3);
    printf("set bit 3     "); show(leds);
    leds |= BIT(0) | BIT(6);
    printf("set 0 and 6   "); show(leds);
    leds &= ~BIT(6);
    printf("clear bit 6   "); show(leds);
    leds ^= BIT(3);
    printf("toggle bit 3  "); show(leds);
    leds ^= BIT(3);
    printf("toggle bit 3  "); show(leds);

    if (leds & BIT(3)) {
        printf("bit 3 is ON\n");
    } else {
        printf("bit 3 is OFF\n");
    }
    return 0;
}
