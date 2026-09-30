#include <stdint.h>

#define GPIOA_BSRR (*(volatile uint32_t *)0x40020018u)

static inline void led_on(void)
{
    GPIOA_BSRR = 1u << 5;
}

static inline void led_off(void)
{
    GPIOA_BSRR = 1u << 21;
}

void led_pulse(void)
{
    led_on();
    led_off();
}
