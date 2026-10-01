#include <stdio.h>

int main(void)
{
    volatile int total = 100;
    volatile int count = 0;
    printf("%d\n", total / count);
    return 0;
}
