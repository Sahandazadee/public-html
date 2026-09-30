#include <stdio.h>

static int square(int x) { return x * x; }

int main(void)
{
    int (*fp)(int) = square;
    int r = fp(5);

    printf("square(5) = %d\n", r);
    printf("fp is %s\n", fp != NULL ? "set" : "NULL");
    return 0;
}
