#include <stdio.h>

int main(void)
{
    int a = -1;
    unsigned int b = 1;

    if (a < b) {
        printf("-1 is less than 1\n");
    } else {
        printf("surprise: -1 is NOT less than 1\n");
    }
    return 0;
}
