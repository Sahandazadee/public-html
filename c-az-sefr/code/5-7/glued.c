#include <stdint.h>

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830u)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000u)
#define GPIOA_BSRR  (*(volatile uint32_t *)0x40020018u)

static int g_led_on;

int main(void)
{
    RCC_AHB1ENR |= 1u;
    GPIOA_MODER = (GPIOA_MODER & ~(3u << 10)) | (1u << 10);

    for (;;) {
        g_led_on = !g_led_on;
        GPIOA_BSRR = g_led_on ? (1u << 5) : (1u << 21);
        for (volatile uint32_t i = 0; i < 400000u; i++) {
        }
    }
}
