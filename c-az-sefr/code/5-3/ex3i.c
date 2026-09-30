#include <stdint.h>

#define RCC_AHB1ENR   (*(volatile uint32_t *)0x40023830u)
#define RCC_APB2ENR   (*(volatile uint32_t *)0x40023844u)
#define GPIOA_MODER   (*(volatile uint32_t *)0x40020000u)
#define GPIOA_BSRR    (*(volatile uint32_t *)0x40020018u)
#define GPIOC_PUPDR   (*(volatile uint32_t *)0x4002080Cu)
#define GPIOC_IDR     (*(volatile uint32_t *)0x40020810u)
#define SYSCFG_EXTICR4 (*(volatile uint32_t *)0x40013814u)
#define EXTI_IMR      (*(volatile uint32_t *)0x40013C00u)
#define EXTI_RTSR     (*(volatile uint32_t *)0x40013C08u)
#define EXTI_FTSR     (*(volatile uint32_t *)0x40013C0Cu)
#define EXTI_PR       (*(volatile uint32_t *)0x40013C14u)
#define NVIC_ISER1    (*(volatile uint32_t *)0xE000E104u)

void EXTI15_10_IRQHandler(void)
{
    if (EXTI_PR & (1u << 13)) {
        EXTI_PR = 1u << 13;
        if (GPIOC_IDR & (1u << 13)) {
            GPIOA_BSRR = 1u << 21;
        } else {
            GPIOA_BSRR = 1u << 5;
        }
    }
}

int main(void)
{
    RCC_AHB1ENR |= (1u << 0) | (1u << 2);
    RCC_APB2ENR |= 1u << 14;
    (void)RCC_APB2ENR;

    GPIOA_MODER = (GPIOA_MODER & ~(3u << 10)) | (1u << 10);
    GPIOC_PUPDR = (GPIOC_PUPDR & ~(3u << 26)) | (1u << 26);

    SYSCFG_EXTICR4 = (SYSCFG_EXTICR4 & ~(0xFu << 4)) | (0x2u << 4);
    EXTI_FTSR |= 1u << 13;
    EXTI_RTSR |= 1u << 13;
    EXTI_PR = 1u << 13;
    EXTI_IMR |= 1u << 13;
    NVIC_ISER1 = 1u << 8;

    for (;;) {
        __asm volatile ("wfi");
    }
}
