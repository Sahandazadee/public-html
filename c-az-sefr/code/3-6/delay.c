#include <stdint.h>

void delay_plain(void)
{
    for (uint32_t i = 0; i < 1000000u; i++) {
    }
}

void delay_volatile(void)
{
    for (volatile uint32_t i = 0; i < 1000000u; i++) {
    }
}
