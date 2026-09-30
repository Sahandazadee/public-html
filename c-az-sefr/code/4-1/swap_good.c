#include <stdio.h>

#define SWAP_INT(a, b)  do { int tmp_ = (a); (a) = (b); (b) = tmp_; } while (0)

int main(void)
{
    int x = 2, y = 1;
    if (x > y)
        SWAP_INT(x, y);
    else
        printf("already ordered\n");
    printf("%d %d\n", x, y);
    return 0;
}
