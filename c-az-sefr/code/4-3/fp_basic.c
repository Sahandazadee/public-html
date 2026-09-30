#include <stdio.h>

static int add(int a, int b) { return a + b; }
static int sub(int a, int b) { return a - b; }

int main(void)
{
    int (*op)(int, int);        // اشاره‌گر به تابع (هنوز مقدار ندارد)

    op = add;                   // آدرس add را بگذار
    printf("op = add: %d\n", op(7, 3));

    op = sub;                   // حالا آدرس sub
    printf("op = sub: %d\n", op(7, 3));

    printf("op == add ? %d\n", op == add);
    return 0;
}
