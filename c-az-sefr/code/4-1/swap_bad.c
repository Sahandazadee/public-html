#include <stdio.h>

#define SWAP_BAD(a, b)  tmp = a; a = b; b = tmp;

int main(void)
{
    int x = 2, y = 1, tmp;
    if (x > y)
        SWAP_BAD(x, y)
    else
        printf("already ordered\n");
    printf("%d %d\n", x, y);
    return 0;
}
