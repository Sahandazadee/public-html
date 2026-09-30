#include <stdio.h>
#include "hal.h"

__attribute__((weak)) void hal_button_callback(int pin)
{
    printf("default: pin %d ignored\n", pin);
}

void hal_irq(int pin)
{
    hal_button_callback(pin);
}
