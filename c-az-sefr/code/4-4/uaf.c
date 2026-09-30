#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int *p = malloc(sizeof *p);
    if (p == NULL) {
        return 1;
    }
    *p = 7;
    free(p);
    printf("%d\n", *p);             // باگ: p آویزان است
    return 0;
}
