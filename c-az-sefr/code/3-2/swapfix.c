#include <stdio.h>

static void swap(int *a, int *b)
{
    if (a == NULL || b == NULL) {
        return;
    }
    int t = *a;
    *a = *b;
    *b = t;
}

int main(void)
{
    int x = 3;
    int y = 8;

    swap(&x, &y);
    printf("x = %d, y = %d\n", x, y);
    swap(&x, NULL);
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
