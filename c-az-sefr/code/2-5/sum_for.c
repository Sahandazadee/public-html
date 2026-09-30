#include <stdio.h>

int main(void)
{
    int sum = 0;

    for (int i = 1; i <= 5; i++) {
        sum = sum + i;
        printf("i = %d, sum = %d\n", i, sum);
    }
    printf("total = %d\n", sum);
    return 0;
}
