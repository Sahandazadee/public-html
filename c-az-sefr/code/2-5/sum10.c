#include <stdio.h>

int main(void)
{
    int sum_all = 0;
    int sum_even = 0;

    for (int i = 1; i <= 10; i++) {
        sum_all = sum_all + i;
    }
    for (int i = 2; i <= 10; i += 2) {
        sum_even = sum_even + i;
    }
    printf("sum of 1..10 = %d\n", sum_all);
    printf("sum of evens = %d\n", sum_even);
    return 0;
}
