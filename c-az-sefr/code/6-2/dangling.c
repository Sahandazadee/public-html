#include <stdio.h>

int main(void)
{
    int a = 1, b = 0;
    if (a)
        if (b)
            printf("both\n");
    else
        printf("a is false\n");
    return 0;
}
