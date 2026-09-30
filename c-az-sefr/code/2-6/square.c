#include <stdio.h>

int square(int n)
{
    return n * n;
}

int main(void)
{
    int a = square(4);
    int b = square(a);
    printf("square(4) = %d\n", a);
    printf("square(16) = %d\n", b);
    return 0;
}
