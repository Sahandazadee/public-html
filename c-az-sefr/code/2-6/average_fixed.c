#include <stdio.h>

int average(int a, int b)
{
    return (a + b) / 2;
}

int main(void)
{
    int avg = average(10, 20);
    printf("average = %d\n", avg);
    return 0;
}
