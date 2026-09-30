#ifndef LED_H
#define LED_H

#include <stdbool.h>
#include <stdint.h>
#include "hal_gpio.h"

typedef enum {
    LED_OK = 0,
    LED_ERR_ARG,
    LED_ERR_HW
} led_status_t;

typedef struct {
    uint8_t pin;
    bool active_low;        /* true: سطح LOW یعنی روشن */
} led_config_t;

typedef struct {
    const hal_gpio_ops_t *gpio;     /* خصوصی: مستقیم دست نزن */
    led_config_t cfg;
    bool on;
} led_t;

led_status_t led_init(led_t *led, const hal_gpio_ops_t *gpio,
                      const led_config_t *cfg);
led_status_t led_on(led_t *led);
led_status_t led_off(led_t *led);
led_status_t led_toggle(led_t *led);
bool led_is_on(const led_t *led);

#endif
