#include <stdlib.h>

int main(void)
{
    int *p = malloc(10 * sizeof *p);
    if (p == NULL) {
        return 1;
    }
    p[0] = 42;
    return 0;                       // free فراموش شد!
}
