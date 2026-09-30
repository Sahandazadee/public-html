#include <stdio.h>

#define MAX(a, b)  ((a) > (b) ? (a) : (b))

int main(void)
{
    int x = 5;
    int y = 5;
    int m = MAX(x, y++);     // y++ دو جا کپی می‌شود!
    printf("m=%d y=%d\n", m, y);
    return 0;
}
