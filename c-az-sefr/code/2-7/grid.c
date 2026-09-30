#include <stdio.h>

int main(void)
{
    int grid[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    for (int row = 0; row < 2; row++) {
        for (int col = 0; col < 3; col++) {
            printf("%d ", grid[row][col]);
        }
        printf("\n");
    }
    printf("sizeof(grid) = %zu\n", sizeof(grid));
    printf("grid[1][0] = %d\n", grid[1][0]);
    return 0;
}
