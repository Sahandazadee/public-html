#include <stdint.h>

#include "hal_gpio_stm32.h"
#include "led.h"

#define BOARD_LED_PIN HAL_PIN('A', 5)      /* LD2 روی Nucleo-F411RE */

static void delay_rough(void)
{
    for (volatile uint32_t i = 0; i < 400000u; i++) {
    }
}

int main(void)
{
    led_t ld2;
    const led_config_t cfg = { .pin = BOARD_LED_PIN, .active_low = false };

    if (led_init(&ld2, &hal_gpio_stm32_ops, &cfg) != LED_OK) {
        for (;;) {
        }
    }
    for (;;) {
        led_toggle(&ld2);
        delay_rough();
    }
}
