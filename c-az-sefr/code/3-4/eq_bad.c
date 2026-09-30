#include <stdio.h>

typedef struct {
    int x;
    int y;
} point_t;

int main(void)
{
    point_t a = {1, 2};
    point_t b = {1, 2};
    if (a == b) {
        printf("same\n");
    }
    return 0;
}
