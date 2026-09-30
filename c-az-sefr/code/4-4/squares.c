#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    size_t n = 6;
    int *sq = calloc(n, sizeof *sq);
    if (sq == NULL) {
        printf("out of memory\n");
        return 1;
    }

    int sum = 0;
    printf("squares:");
    for (size_t i = 0; i < n; i++) {
        sq[i] = (int)((i + 1) * (i + 1));
        sum += sq[i];
        printf(" %d", sq[i]);
    }
    printf("\nsum = %d\n", sum);

    free(sq);
    return 0;
}
