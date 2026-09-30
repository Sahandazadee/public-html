#include <stdio.h>

int main(void)
{
    int a = 0;
    while (a < 3) {
        printf("a = %d\n", a);
        a++;
    }

    for (int b = 0; b < 3; b++) {
        printf("b = %d\n", b);
    }

    for (int c = 0; c < 3; c++) {
        printf("c = %d\n", c);
    }
    return 0;
}
