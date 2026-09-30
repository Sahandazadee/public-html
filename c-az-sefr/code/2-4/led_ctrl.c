#include <stdio.h>

int main(void)
{
    int button_level = 0;
    int enabled = 0;
    int override = 0;
    int led_on = 0;

    led_on = (button_level == 0 && enabled) ? 1 : 0;
    printf("button=%d enabled=%d override=%d -> LED %d\n",
           button_level, enabled, override, led_on);

    override = 1;
    led_on = ((button_level == 0 && enabled) || override) ? 1 : 0;
    printf("button=%d enabled=%d override=%d -> LED %d\n",
           button_level, enabled, override, led_on);
    return 0;
}
