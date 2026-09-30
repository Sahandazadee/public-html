#include <stdio.h>

int main(void)
{
    int i = 5;
    int a = i++;
    int b = ++i;
    int total = 10;

    total += 5;
    total *= 2;
    total -= 6;
    total /= 4;
    total %= 4;

    printf("a = %d, b = %d, i = %d\n", a, b, i);
    printf("total = %d\n", total);
    return 0;
}
