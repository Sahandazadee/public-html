#include <stdio.h>

int main(void)
{
    int a = 17;
    int b = 5;

    printf("a + b = %d\n", a + b);
    printf("a - b = %d\n", a - b);
    printf("a * b = %d\n", a * b);
    printf("a / b = %d\n", a / b);
    printf("a %% b = %d\n", a % b);
    printf("-a / b = %d\n", -a / b);
    printf("-a %% b = %d\n", -a % b);
    printf("a / 5.0 = %.1f\n", a / 5.0);
    return 0;
}
