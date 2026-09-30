#include <stdio.h>

typedef struct {
    int x;
    int y;
} point_t;

int main(void)
{
    point_t a = {1, 2};
    point_t *p = &a;
    printf("%d\n", p.x);
    return 0;
}
