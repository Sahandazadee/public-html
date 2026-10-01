#include <stdio.h>

int main(void)
{
    int *p = NULL;
    printf("about to write\n");
    fflush(stdout);
    *p = 42;
    return 0;
}
