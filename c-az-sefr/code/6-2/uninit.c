#include <stdio.h>

int main(void)
{
    int count;
    for (int i = 0; i < 3; i++)
        count += i;
    printf("count = %d\n", count);
    return 0;
}
