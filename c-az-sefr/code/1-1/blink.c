#include <stdint.h>

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000)
#define GPIOA_BSRR  (*(volatile uint32_t *)0x40020018)

static void wait_a_bit(void)
{
    for (volatile uint32_t i = 0; i < 800000; i++) { }
}

int main(void)
{
    RCC_AHB1ENR |= 1U << 0;                                  // برق پورت A را وصل کن
    GPIOA_MODER = (GPIOA_MODER & ~(3U << 10)) | (1U << 10);  // پایه PA5 را خروجی کن

    for (;;) {
        GPIOA_BSRR = 1U << 5;       // LED روشن
        wait_a_bit();
        GPIOA_BSRR = 1U << 21;      // LED خاموش
        wait_a_bit();
    }
}
