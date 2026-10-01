#include <limits.h>
#include <stdio.h>

int main(void)
{
    int x = INT_MAX;
    x = x + 1;
    printf("%d\n", x);
    return 0;
}
