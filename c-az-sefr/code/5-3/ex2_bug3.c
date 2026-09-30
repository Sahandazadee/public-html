#include <stdint.h>

#define EXTI_PR    (*(volatile uint32_t *)0x40013C14u)
#define NVIC_ISER1 (*(volatile uint32_t *)0xE000E104u)
#define GPIOA_BSRR (*(volatile uint32_t *)0x40020018u)

static uint32_t pressed;

void EXTI15_10_IRQHandler(void)
{
    pressed = 1u;
}

int main(void)
{
    /* فرض کن ساعت‌ها، SYSCFG و EXTI درست تنظیم شده‌اند */
    NVIC_ISER1 = 1u << 7;

    while (pressed == 0u) {
    }
    GPIOA_BSRR = 1u << 5;
    for (;;) {
    }
}
