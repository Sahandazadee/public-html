#include <stdio.h>

static void swap_bug(int *a, int *b)
{
    int *t = a;
    a = b;
    b = t;
}

int main(void)
{
    int x = 3;
    int y = 8;

    swap_bug(&x, &y);
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
