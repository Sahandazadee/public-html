#include "board.h"

#define LED_PIN    5u
#define BUTTON_PIN 13u

static volatile uint32_t button_event;   /* ISR می‌نویسد، main می‌خواند */
static uint32_t press_count;             /* فقط main به آن دست می‌زند */

void EXTI15_10_IRQHandler(void)
{
    if (EXTI->PR & (1u << BUTTON_PIN)) {
        EXTI->PR = 1u << BUTTON_PIN;        /* پرچم را با نوشتن ۱ پاک کن */
        EXTI->IMR &= ~(1u << BUTTON_PIN);   /* تا پایان پرش‌ها ساکت */
        button_event = 1u;
    }
}

static void delay(volatile uint32_t n)
{
    while (n--) {
    }
}

static void wait_until_released(void)
{
    delay(30000u);                                       /* پرش‌های فشردن */
    while ((GPIOC->IDR & (1u << BUTTON_PIN)) == 0u) {
    }
    delay(30000u);                                       /* پرش‌های رها کردن */
}

int main(void)
{
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN | RCC_AHB1ENR_GPIOCEN;
    RCC->APB2ENR |= RCC_APB2ENR_SYSCFGEN;
    (void)RCC->APB2ENR;

    GPIOA->MODER = (GPIOA->MODER & ~(3u << (LED_PIN * 2u)))
                 | (1u << (LED_PIN * 2u));
    GPIOC->MODER &= ~(3u << (BUTTON_PIN * 2u));
    GPIOC->PUPDR = (GPIOC->PUPDR & ~(3u << (BUTTON_PIN * 2u)))
                 | (1u << (BUTTON_PIN * 2u));

    SYSCFG->EXTICR[3] = (SYSCFG->EXTICR[3] & ~(0xFu << 4)) | (0x2u << 4);
    EXTI->FTSR |= 1u << BUTTON_PIN;
    EXTI->RTSR &= ~(1u << BUTTON_PIN);
    EXTI->PR = 1u << BUTTON_PIN;
    EXTI->IMR |= 1u << BUTTON_PIN;
    nvic_set_priority(EXTI15_10_IRQn, 5u);
    nvic_enable(EXTI15_10_IRQn);

    for (;;) {
        irq_disable();
        if (button_event == 0u) {
            wait_for_irq();
        }
        irq_enable();

        if (button_event != 0u) {
            button_event = 0u;
            press_count++;
            GPIOA->BSRR = (press_count & 1u) ? (1u << LED_PIN)
                                              : (1u << (LED_PIN + 16u));
            wait_until_released();
            EXTI->PR = 1u << BUTTON_PIN;
            EXTI->IMR |= 1u << BUTTON_PIN;
        }
    }
}
