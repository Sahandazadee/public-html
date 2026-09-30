#include <stdio.h>

typedef struct {
    int x;
    int y;
} point_t;

typedef struct {
    point_t top_left;
    int w;
    int h;
} rect_t;

static void move_by_value(point_t p)
{
    p.x += 10;                      // فقط کپی عوض می‌شود
}

static void move_by_ptr(point_t *p)
{
    p->x += 10;                     // خود شیء اصلی عوض می‌شود
}

static int area(const rect_t *r)
{
    return r->w * r->h;
}

int main(void)
{
    point_t a = {1, 2};
    rect_t box = {.top_left = {0, 0}, .w = 4, .h = 3};

    move_by_value(a);
    printf("after by value: x=%d\n", a.x);
    move_by_ptr(&a);
    printf("after by pointer: x=%d\n", a.x);
    printf("area=%d, corner x=%d\n", area(&box), box.top_left.x);
    return 0;
}
