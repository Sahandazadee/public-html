#include <stdio.h>
#include "hal.h"

void hal_button_callback(int pin)       // نسخهٔ کاربر
{
    printf("user: pin %d handled\n", pin);
}

int main(void)
{
    hal_irq(13);
    return 0;
}
