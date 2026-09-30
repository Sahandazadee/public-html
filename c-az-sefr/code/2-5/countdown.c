#include <stdio.h>

int main(void)
{
    int count = 3;

    while (count > 0) {
        printf("count = %d\n", count);
        count = count - 1;
    }
    printf("liftoff\n");
    return 0;
}
