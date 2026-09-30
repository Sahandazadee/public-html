#include <stdint.h>

#define GPIOA_MODER (*(volatile uint32_t *)0x40020000u)
#define GPIOA_BSRR  (*(volatile uint32_t *)0x40020018u)

static void delay(void)
{
    for (uint32_t i = 0; i < 400000u; i++) {
    }
}

int main(void)
{
    GPIOA_MODER = 1u << 10;
    for (;;) {
        GPIOA_BSRR = 1u << 5;
        delay();
        GPIOA_BSRR = 1u << 5;
        delay();
    }
}
