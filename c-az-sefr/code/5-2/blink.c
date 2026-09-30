#include "stm32f4.h"

#define LED_PIN 5u

static void delay(volatile uint32_t n)
{
    while (n--) {
    }
}

int main(void)
{
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    (void)RCC->AHB1ENR;
    GPIOA->MODER = (GPIOA->MODER & ~(3u << (LED_PIN * 2u)))
                 | (1u << (LED_PIN * 2u));

    for (;;) {
        GPIOA->BSRR = 1u << LED_PIN;
        delay(400000u);
        GPIOA->BSRR = 1u << (LED_PIN + 16u);
        delay(400000u);
    }
}
