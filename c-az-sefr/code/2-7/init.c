#include <stdio.h>

int main(void)
{
    int zeros[4] = {0};
    int part[5] = {1, 2};
    int pick[6] = {[1] = 10, [4] = 40};

    for (int i = 0; i < 4; i++) { printf("%d ", zeros[i]); }
    printf("\n");
    for (int i = 0; i < 5; i++) { printf("%d ", part[i]); }
    printf("\n");
    for (int i = 0; i < 6; i++) { printf("%d ", pick[i]); }
    printf("\n");
    return 0;
}
