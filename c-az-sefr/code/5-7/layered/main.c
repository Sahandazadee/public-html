#include <stdio.h>

#include "hal_gpio_mock.h"
#include "led.h"

int main(void)
{
    led_t ld2;
    const led_config_t ld2_cfg = { .pin = HAL_PIN('A', 5), .active_low = false };

    if (led_init(&ld2, &hal_gpio_mock_ops, &ld2_cfg) != LED_OK) {
        puts("init failed");
        return 1;
    }
    led_on(&ld2);
    led_toggle(&ld2);
    led_toggle(&ld2);
    printf("LD2 is %s\n", led_is_on(&ld2) ? "on" : "off");

    led_t ext;
    const led_config_t ext_cfg = { .pin = HAL_PIN('B', 0), .active_low = true };
    led_init(&ext, &hal_gpio_mock_ops, &ext_cfg);
    printf("ext pin right after init = %d (active-low LED is off)\n",
           (int)hal_gpio_mock_level(ext_cfg.pin));
    led_on(&ext);
    printf("ext pin level = %d (active-low LED is on)\n",
           (int)hal_gpio_mock_level(ext_cfg.pin));

    uint8_t b1 = HAL_PIN('C', 13);
    hal_level_t level = HAL_LOW;
    hal_gpio_mock_ops.init_input(b1, HAL_PULL_UP);
    hal_gpio_mock_ops.read(b1, &level);
    printf("B1 released = %d\n", (int)level);
    hal_gpio_mock_set_input(b1, HAL_LOW);
    hal_gpio_mock_ops.read(b1, &level);
    printf("B1 pressed  = %d\n", (int)level);

    hal_gpio_mock_fail_writes(1);
    led_status_t st = led_off(&ld2);
    printf("led_off on broken bus -> %d, LD2 still %s\n",
           (int)st, led_is_on(&ld2) ? "on" : "off");
    hal_gpio_mock_fail_writes(0);

    led_t bad;
    const led_config_t bad_cfg = { .pin = 99u, .active_low = false };
    printf("led_init on pin 99 -> %d\n", (int)led_init(&bad, &hal_gpio_mock_ops, &bad_cfg));

    printf("total writes: %u\n", hal_gpio_mock_write_count());
    return 0;
}
