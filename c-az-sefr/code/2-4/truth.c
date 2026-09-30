#include <stdio.h>

int main(void)
{
    int a = 7;
    int zero = 0;

    printf("a > 3 gives %d\n", a > 3);
    printf("a == 3 gives %d\n", a == 3);
    printf("a != 3 gives %d\n", a != 3);

    if (a) {
        printf("a = 7 counts as true\n");
    }
    if (zero) {
        printf("you will never see this\n");
    } else {
        printf("zero counts as false\n");
    }
    return 0;
}
