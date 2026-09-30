#include <stdint.h>

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830u)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000u)
#define GPIOA_BSRR  (*(volatile uint32_t *)0x40020018u)
#define GPIOC_PUPDR (*(volatile uint32_t *)0x4002080Cu)
#define GPIOC_IDR   (*(volatile uint32_t *)0x40020810u)

static void delay(volatile uint32_t n)
{
    while (n--) {
    }
}

int main(void)
{
    RCC_AHB1ENR |= (1u << 0) | (1u << 2);
    (void)RCC_AHB1ENR;
    GPIOA_MODER = (GPIOA_MODER & ~(3u << 10)) | (1u << 10);
    GPIOC_PUPDR = (GPIOC_PUPDR & ~(3u << 26)) | (1u << 26);

    for (;;) {
        uint32_t pressed = (GPIOC_IDR & (1u << 13)) == 0u;
        uint32_t wait = pressed ? 50000u : 400000u;

        GPIOA_BSRR = 1u << 5;
        delay(wait);
        GPIOA_BSRR = 1u << 21;
        delay(wait);
    }
}
