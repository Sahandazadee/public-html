#include <stdio.h>
#include "point.h"
#include "shape.h"

int main(void)
{
    struct segment s = { {0, 0}, {3, 4} };
    printf("%d\n", s.b.x + s.b.y);
    return 0;
}
