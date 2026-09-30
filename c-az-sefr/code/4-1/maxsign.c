#include <stdio.h>

#define MAX(a, b)  ((a) > (b) ? (a) : (b))

int main(void)
{
    unsigned int u = 1u;
    printf("%u\n", MAX(-1, u));
    printf("%d\n", MAX(-1, 1));
    return 0;
}
