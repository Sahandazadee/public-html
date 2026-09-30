#include <stdint.h>

static uint32_t button_pressed;         // ISR این را ۱ می‌کند

void EXTI15_10_IRQHandler(void)
{
    button_pressed = 1;
}

uint32_t wait_for_button(void)
{
    while (button_pressed == 0) {
    }
    return 1;
}
