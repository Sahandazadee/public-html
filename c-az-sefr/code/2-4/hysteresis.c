#include <stdio.h>

int main(void)
{
    int heater_on = 0;
    int temp_c;

    temp_c = 19;
    if (temp_c < 20) { heater_on = 1; } else if (temp_c > 24) { heater_on = 0; }
    printf("temp %d -> heater %d\n", temp_c, heater_on);

    temp_c = 22;
    if (temp_c < 20) { heater_on = 1; } else if (temp_c > 24) { heater_on = 0; }
    printf("temp %d -> heater %d\n", temp_c, heater_on);

    temp_c = 25;
    if (temp_c < 20) { heater_on = 1; } else if (temp_c > 24) { heater_on = 0; }
    printf("temp %d -> heater %d\n", temp_c, heater_on);

    temp_c = 22;
    if (temp_c < 20) { heater_on = 1; } else if (temp_c > 24) { heater_on = 0; }
    printf("temp %d -> heater %d\n", temp_c, heater_on);
    return 0;
}
