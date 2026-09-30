#include <stdbool.h>
#include <stdio.h>

static int s_level[16];

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
    gpio_write(led->pin, (on != led->active_low) ? 1 : 0);
}

static int check(bool active_low, bool on, int want_level)
{
    led_t led = { .pin = 3, .active_low = active_low, .on = false };

    led_set(&led, on);
    int ok = (s_level[3] == want_level);
    printf("active_low=%d on=%d -> level %d %s\n",
           active_low, on, s_level[3], ok ? "PASS" : "FAIL");
    return ok;
}

int main(void)
{
    int ok = 1;

    ok &= check(false, true, 1);
    ok &= check(false, false, 0);
    ok &= check(true, true, 0);
    ok &= check(true, false, 1);
    return ok ? 0 : 1;
}
