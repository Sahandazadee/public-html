#include <stdio.h>

int main(void)
{
    int x = 5;
    int *a, b;
    a = &x;
    b = &x;
    printf("%d %d\n", *a, b);
    return 0;
}
