#include <stdio.h>

static int *counter_ptr(void)
{
    static int n = 42;          // static: تا آخر برنامه زنده است
    return &n;
}

static void fill_number(int *out)
{
    *out = 42;                  // نتیجه در قفسهٔ صدازننده نوشته می‌شود
}

int main(void)
{
    int *p = counter_ptr();
    int mine;
    fill_number(&mine);
    printf("%d %d\n", *p, mine);
    return 0;
}
