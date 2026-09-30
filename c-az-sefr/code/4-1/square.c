#include <stdio.h>

#define SQUARE_BAD(x)  x * x
#define SQUARE(x)      ((x) * (x))

int main(void)
{
    int n = 3;
    printf("bad : %d\n", SQUARE_BAD(n + 1));
    printf("good: %d\n", SQUARE(n + 1));
    return 0;
}
