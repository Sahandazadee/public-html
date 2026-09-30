#include <stdio.h>

int main(void)
{
    int den = 0;
    int b = 5;

    int r1 = (den != 0) && (100 / den > 3);
    printf("r1 = %d\n", r1);

    int r2 = (den == 0) || (++b > 0);
    printf("r2 = %d, b = %d\n", r2, b);

    int r3 = (den == 0) && (++b > 0);
    printf("r3 = %d, b = %d\n", r3, b);
    return 0;
}
