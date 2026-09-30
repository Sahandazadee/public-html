#include <stdio.h>

int main(void)
{
    int heater_on = 0;
    int temp_c = 18;

    if (temp_c < 20) {
        heater_on = 1;
        printf("heater switched on\n");
    }

    switch (heater_on) {
    case 0:
        printf("off\n");
        break;
    case 1:
        printf("on\n");
        break;
    default:
        break;
    }
    return 0;
}
