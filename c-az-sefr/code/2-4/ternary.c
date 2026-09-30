#include <stdio.h>

int main(void)
{
    int temp_c = 35;
    int fan_speed = (temp_c > 30) ? 100 : 0;
    int bigger = (5 > 3) ? 5 : 3;

    printf("fan_speed = %d\n", fan_speed);
    printf("bigger = %d\n", bigger);
    return 0;
}
