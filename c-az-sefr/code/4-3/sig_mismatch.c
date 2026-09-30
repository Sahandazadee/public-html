#include <stdio.h>

static int add(int a, int b) { return a + b; }

int main(void)
{
    int (*op)(int) = add;       // op یک ورودی می‌گیرد، add دو ورودی
    printf("%d\n", op(1));
    return 0;
}
