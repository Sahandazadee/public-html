#include <stdio.h>

int main(void)
{
    int temps[5] = {21, 23, 22, 25, 24};
    int sum = 0;

    printf("first = %d, last = %d\n", temps[0], temps[4]);
    temps[2] = 30;

    for (int i = 0; i < 5; i++) {
        sum = sum + temps[i];
    }
    printf("sum = %d, average = %d\n", sum, sum / 5);
    return 0;
}
