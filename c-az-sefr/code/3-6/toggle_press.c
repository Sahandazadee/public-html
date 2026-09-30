#include <stdint.h>

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830u)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000u)
#define GPIOA_ODR   (*(volatile uint32_t *)0x40020014u)
#define GPIOA_BSRR  (*(volatile uint32_t *)0x40020018u)
#define GPIOC_IDR   (*(const volatile uint32_t *)0x40020810u)

int main(void)
{
    RCC_AHB1ENR |= (1u << 0) | (1u << 2);
    (void)RCC_AHB1ENR;
    GPIOA_MODER = (GPIOA_MODER & ~(3u << 10)) | (1u << 10);

    uint32_t was_high = 1;
    for (;;) {
        uint32_t is_high = (GPIOC_IDR >> 13) & 1u;
        if (was_high == 1 && is_high == 0) {
            if (GPIOA_ODR & (1u << 5)) {
                GPIOA_BSRR = 1u << 21;
            } else {
                GPIOA_BSRR = 1u << 5;
            }
        }
        was_high = is_high;
    }
}
