#include <stdio.h>

#define MIN(a, b)         ((a) < (b) ? (a) : (b))
#define MAX(a, b)         ((a) > (b) ? (a) : (b))
#define CLAMP(v, lo, hi)  MIN(MAX((v), (lo)), (hi))
#define DOUBLE_BAD(x)     x * 2
#define DOUBLE(x)         ((x) * 2)

int main(void)
{
    printf("bad    = %d\n", DOUBLE_BAD(3 + 1));
    printf("good   = %d\n", DOUBLE(3 + 1));
    printf("clamp  = %d %d %d\n", CLAMP(-5, 0, 100), CLAMP(50, 0, 100), CLAMP(250, 0, 100));
    return 0;
}
