#include <stdio.h>

int main(void)
{
    int x = 1;
    const int *p = &x;
    *p = 5;
    printf("%d\n", x);
    return 0;
}
