#include <stdio.h>
#include "led.h"

int main(void)
{
    led_t *ld2 = led_get(0);
    led_on(ld2);
    printf("led on: %d\n", led_is_on(ld2));
    led_off(ld2);
    printf("led on: %d\n", led_is_on(ld2));
    return 0;
}
