#include "led.h"

struct led {
    int pin;
    int on;
};

static led_t leds[2] = { { 5, 0 }, { 2, 0 } };

led_t *led_get(unsigned index)
{
    if (index >= 2U) {
        return 0;
    }
    return &leds[index];
}

void led_on(led_t *led)  { led->on = 1; }
void led_off(led_t *led) { led->on = 0; }
int led_is_on(const led_t *led) { return led->on; }
