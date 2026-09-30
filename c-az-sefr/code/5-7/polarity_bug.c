#include <stdbool.h>
#include <stdio.h>

static int s_level[16];                 /* سطح پایه‌های ساختگی */

static void gpio_write(int pin, int level)
{
    s_level[pin] = level;
}

typedef struct {
    int pin;
    bool active_low;
    bool on;
} led_t;

static void led_set(led_t *led, bool on)
{
    led->on = on;
    gpio_write(led->pin, on ? 1 : 0);
}

int main(void)
{
    led_t led = { .pin = 3, .active_low = true, .on = false };

    led_set(&led, true);
    printf("led on=%d, pin level=%d\n", led.on, s_level[led.pin]);
    return 0;
}
