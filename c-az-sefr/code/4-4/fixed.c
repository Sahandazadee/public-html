#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
    const char *name = "sensor";
    char *copy = malloc(strlen(name) + 1);
    int *v = malloc(10 * sizeof *v);
    int *p = malloc(sizeof *p);
    if (copy == NULL || v == NULL || p == NULL) {
        free(copy);
        free(v);
        free(p);
        return 1;
    }

    strcpy(copy, name);
    printf("copy: %s\n", copy);

    v[5] = 1;
    printf("v[5] = %d, count = %d\n", v[5], 10);

    *p = 3;
    printf("p was %d\n", *p);

    free(copy);
    free(v);
    free(p);
    return 0;
}
