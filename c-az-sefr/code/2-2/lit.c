#include <stdio.h>

int main(void)
{
    printf("sizeof(1)    = %zu\n", sizeof(1));
    printf("sizeof(1L)   = %zu\n", sizeof(1L));
    printf("sizeof(1LL)  = %zu\n", sizeof(1LL));
    printf("sizeof(1.5)  = %zu\n", sizeof(1.5));
    printf("sizeof(1.5f) = %zu\n", sizeof(1.5f));
    printf("sizeof('A')  = %zu\n", sizeof('A'));
    return 0;
}
