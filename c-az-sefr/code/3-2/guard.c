#include <stdio.h>

static int read_or_default(int *p, int fallback)
{
    if (p == NULL) {
        return fallback;
    }
    return *p;
}

int main(void)
{
    int value = 42;
    int *good = &value;
    int *none = NULL;

    printf("good -> %d\n", read_or_default(good, -1));
    printf("none -> %d\n", read_or_default(none, -1));
    return 0;
}
