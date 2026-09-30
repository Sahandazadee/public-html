#include <stdint.h>

#define GPIOA_ODR  (*(volatile uint32_t *)0x40020014u)
#define GPIOA_BSRR (*(volatile uint32_t *)0x40020018u)

void led_on_rmw(void)
{
    GPIOA_ODR |= 1u << 5;
}

void led_on_bsrr(void)
{
    GPIOA_BSRR = 1u << 5;
}
