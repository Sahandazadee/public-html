#include <stdio.h>

int main(void)
{
    int a[3] = {1, 2, 3};
    int b[3];
    int same = 1;

    for (int i = 0; i < 3; i++) {
        b[i] = a[i];
    }
    for (int i = 0; i < 3; i++) {
        if (a[i] != b[i]) {
            same = 0;
        }
    }
    printf("same = %d\n", same);
    return 0;
}
