#include <stdio.h>

int main(void)
{
    int readings[5] = {10, 20, 30, 40, 50};
    int count = sizeof(readings) / sizeof(readings[0]);
    int sum = 0;

    for (int i = 0; i < count; i++) {
        sum += readings[i];
    }
    printf("average = %d\n", sum / count);
    return 0;
}
