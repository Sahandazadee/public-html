#include <stdio.h>

int main(void)
{
    int a = 7;
    int b = 8;

    printf("a = %d, b = %d\n", a, b);
    printf("&a != &b : %d\n", &a != &b);
    printf("address of a: %p\n", (void *)&a);
    printf("address of b: %p\n", (void *)&b);
    return 0;
}
