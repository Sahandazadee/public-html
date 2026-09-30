#include "stm32f4.h"

#define LED_PIN    5u
#define BUTTON_PIN 13u

static int button_pressed(void)
{
    return (GPIOC->IDR & (1u << BUTTON_PIN)) == 0u;
}

int main(void)
{
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN | RCC_AHB1ENR_GPIOCEN;
    (void)RCC->AHB1ENR;

    GPIOA->MODER = (GPIOA->MODER & ~(3u << (LED_PIN * 2u)))
                 | (1u << (LED_PIN * 2u));
    GPIOC->MODER &= ~(3u << (BUTTON_PIN * 2u));
    GPIOC->PUPDR = (GPIOC->PUPDR & ~(3u << (BUTTON_PIN * 2u)))
                 | (1u << (BUTTON_PIN * 2u));

    for (;;) {
        if (button_pressed()) {
            GPIOA->BSRR = 1u << LED_PIN;
        } else {
            GPIOA->BSRR = 1u << (LED_PIN + 16u);
        }
    }
}
