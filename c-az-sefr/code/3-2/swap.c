#include <stdio.h>

static void swap_copy(int a, int b)
{
    int t = a;
    a = b;
    b = t;
}

static void swap(int *a, int *b)
{
    int t = *a;
    *a = *b;
    *b = t;
}

int main(void)
{
    int x = 1;
    int y = 2;

    swap_copy(x, y);
    printf("after swap_copy: x = %d, y = %d\n", x, y);

    swap(&x, &y);
    printf("after swap:      x = %d, y = %d\n", x, y);
    return 0;
}
