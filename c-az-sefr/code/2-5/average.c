#include <stdio.h>

int main(void)
{
    const int n = 5;
    int total = 0;

    for (int i = 0; i < n; i++) {
        int reading = 500 + i * i;
        total = total + reading;
    }
    int average = total / n;

    printf("total = %d\n", total);
    printf("average = %d\n", average);
    return 0;
}
