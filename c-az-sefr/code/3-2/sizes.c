#include <stdio.h>

int main(void)
{
    printf("sizeof(int)      = %zu\n", sizeof(int));
    printf("sizeof(char *)   = %zu\n", sizeof(char *));
    printf("sizeof(int *)    = %zu\n", sizeof(int *));
    printf("sizeof(double *) = %zu\n", sizeof(double *));
    return 0;
}
