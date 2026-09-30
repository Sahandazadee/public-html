#include <stdio.h>

int main(void)
{
    for (int row = 1; row <= 3; row++) {
        for (int col = 1; col <= 4; col++) {
            printf("%3d", row * col);
        }
        printf("\n");
    }
    return 0;
}
