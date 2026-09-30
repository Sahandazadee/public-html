#include <stdio.h>

int main(void)
{
    int sensor_ok = 1;
    int temp_c = 24;

    if (!sensor_ok) {
        printf("error: sensor failed\n");
        return 1;
    }
    if (temp_c > 40) {
        printf("error: too hot\n");
        return 2;
    }

    printf("temperature is fine: %d\n", temp_c);
    return 0;
}
