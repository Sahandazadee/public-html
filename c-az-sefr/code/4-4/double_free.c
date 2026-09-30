#include <stdlib.h>

int main(void)
{
    int *p = malloc(sizeof *p);
    if (p == NULL) {
        return 1;
    }
    free(p);
    free(p);                        // باگ: دوبار free
    return 0;
}
