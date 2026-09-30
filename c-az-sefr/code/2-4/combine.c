#include <stdio.h>

int main(void)
{
    int temp_c = 28;
    int humidity = 80;
    int person_home = 1;

    if (temp_c > 25 && humidity > 70) {
        printf("sticky weather\n");
    }
    if (temp_c < 0 || temp_c > 50) {
        printf("sensor out of range\n");
    } else {
        printf("sensor range ok\n");
    }
    if (!person_home) {
        printf("nobody home\n");
    }
    if (temp_c > 25 && person_home) {
        printf("cooler: ON\n");
    }
    return 0;
}
