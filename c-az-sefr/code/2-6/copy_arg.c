#include <stdio.h>

void try_to_change(int x)
{
    x = 99;
    printf("inside:  x = %d\n", x);
}

int main(void)
{
    int x = 5;
    try_to_change(x);
    printf("outside: x = %d\n", x);
    return 0;
}
