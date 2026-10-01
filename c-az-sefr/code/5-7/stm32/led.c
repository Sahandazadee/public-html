#include "led.h"

#include <stddef.h>

static led_status_t from_hal(hal_status_t st)
{
    if (st == HAL_OK) {
        return LED_OK;
    }
    return (st == HAL_ERR_PARAM) ? LED_ERR_ARG : LED_ERR_HW;
}

static led_status_t led_apply(led_t *led, bool on)
{
    bool high = (on != led->cfg.active_low);
    hal_status_t st = led->gpio->write(led->cfg.pin, high ? HAL_HIGH : HAL_LOW);

    if (st != HAL_OK) {
        return from_hal(st);
    }
    led->on = on;
    return LED_OK;
}

led_status_t led_init(led_t *led, const hal_gpio_ops_t *gpio,
                      const led_config_t *cfg)
{
    if (led == NULL || gpio == NULL || cfg == NULL ||
        gpio->init_output == NULL || gpio->write == NULL) {
        return LED_ERR_ARG;
    }
    led->gpio = gpio;
    led->cfg = *cfg;
    led->on = false;

    hal_level_t off_level = cfg->active_low ? HAL_HIGH : HAL_LOW;
    return from_hal(gpio->init_output(cfg->pin, off_level));
}

led_status_t led_on(led_t *led)     { return led_apply(led, true); }
led_status_t led_off(led_t *led)    { return led_apply(led, false); }
led_status_t led_toggle(led_t *led) { return led_apply(led, !led->on); }
bool led_is_on(const led_t *led)    { return led->on; }
