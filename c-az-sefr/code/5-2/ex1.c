#include <stdint.h>

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830u)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000u)
#define GPIOA_BSRR  (*(volatile uint32_t *)0x40020018u)

static void delay(volatile uint32_t n)
{
    while (n--) {
    }
}

static void flash_once(void)
{
    GPIOA_BSRR = 1u << 5;
    delay(150000u);
    GPIOA_BSRR = 1u << 21;
    delay(150000u);
}

int main(void)
{
    RCC_AHB1ENR |= 1u << 0;
    (void)RCC_AHB1ENR;
    GPIOA_MODER = (GPIOA_MODER & ~(3u << 10)) | (1u << 10);

    for (;;) {
        flash_once();
        flash_once();
        delay(1200000u);
    }
}
