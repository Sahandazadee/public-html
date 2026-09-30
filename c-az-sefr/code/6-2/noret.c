#include <stdio.h>

static int sign_of(int x)
{
    if (x > 0)
        return 1;
    if (x < 0)
        return -1;
}                               // اگر x == 0 باشد، چیزی برنمی‌گردد!

int main(void)
{
    printf("%d\n", sign_of(5));
    return 0;
}
