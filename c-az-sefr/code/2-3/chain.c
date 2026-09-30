#include <stdio.h>

int main(void)
{
    int x = 7;

    printf("3 < x < 5  -> %d\n", 3 < x < 5);
    printf("x is between 3 and 5? -> %d\n", 3 < x && x < 5);
    return 0;
}
