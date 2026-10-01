#include <stdio.h>

int main(void)
{
    int a[4] = {10, 20, 30, 40};
    int *p = a;
    int (*whole)[4] = &a;

    printf("sizeof a = %zu\n", sizeof a);
    printf("sizeof *whole = %zu\n", sizeof *whole);
    printf("a + 1 moves %td bytes\n", (char *)(a + 1) - (char *)a);
    printf("&a + 1 moves %td bytes\n", (char *)(&a + 1) - (char *)&a);
    printf("(*whole)[2] = %d, p[2] = %d\n", (*whole)[2], p[2]);
    return 0;
}
