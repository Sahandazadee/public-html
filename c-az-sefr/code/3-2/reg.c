#include <stdint.h>

#define GPIOA_ODR_ADDR 0x40020014U

_Static_assert(sizeof(void *) == 4, "pointers are 32-bit on Cortex-M");

void led_toggle(void)
{
    volatile uint32_t *odr = (volatile uint32_t *)GPIOA_ODR_ADDR;
    *odr ^= (1U << 5);
}
