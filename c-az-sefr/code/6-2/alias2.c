#include <stdio.h>
#include <string.h>

static int poke(int *i, float *f)
{
    *i = 1;
    *f = 2.0f;          // کامپایلر فرض می‌کند f و i یک جا نیستند
    return *i;          // پس شاید همان 1 را برگرداند
}

int main(void)
{
    int box = 0;
    int r = poke(&box, (float *)&box);      // عمدا هر دو به یک جا اشاره می‌کنند
    printf("returned %d\n", r);
    return 0;
}
