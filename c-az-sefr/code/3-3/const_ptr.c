#include <stdio.h>

int main(void)
{
    int x = 1;
    int y = 2;
    int *const p = &x;
    p = &y;
    printf("%d\n", *p);
    return 0;
}
