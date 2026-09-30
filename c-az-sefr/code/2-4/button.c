#include <stdio.h>

int main(void)
{
    int button_level = 0;
    int led_on = 0;

    if (button_level == 0) {
        led_on = 1;
    } else {
        led_on = 0;
    }
    printf("button level = %d, LED = %d\n", button_level, led_on);
    return 0;
}
