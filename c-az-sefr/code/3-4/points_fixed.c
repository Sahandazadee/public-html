#include <stdbool.h>
#include <stdio.h>

typedef struct {
    int x;
    int y;
} point_t;

static bool point_equal(const point_t *a, const point_t *b)
{
    return (a->x == b->x) && (a->y == b->y);
}

int main(void)
{
    point_t a = {1, 2};
    point_t b = {1, 2};
    point_t *p = &a;
    printf("x via pointer = %d\n", p->x);
    printf("equal = %d\n", point_equal(&a, &b));
    return 0;
}
