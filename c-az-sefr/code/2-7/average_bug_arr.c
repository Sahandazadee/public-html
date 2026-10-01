#include <stdio.h>

int main(void)
{
    int readings[5] = {10, 20, 30, 40, 50};
    int sum = 0;

    for (int i = 0; i <= 5; i++) {
        sum += readings[i];
    }
    printf("average = %d\n", sum / 5);
    return 0;
}
