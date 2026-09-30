#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *v = malloc(4 * sizeof *v);
    if (v == NULL) {
        return 1;
    }
    for (int i = 0; i <= 4; i++) {          // باگ: باید i < 4
        v[i] = i;
    }
    printf("done\n");
    free(v);
    return 0;
}
