#include <stdio.h>

int main(void)
{
    int data[5] = {3, 8, 1, 9, 4};
    int *end = data + 5;           // یکی بعد از آخرین عنصر
    int sum = 0;
    int max = data[0];

    for (int *p = data; p < end; p++) {
        sum += *p;
        if (*p > max) {
            max = *p;
        }
    }
    printf("sum = %d, max = %d\n", sum, max);
    return 0;
}
