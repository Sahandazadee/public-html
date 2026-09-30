#include <stdio.h>

static int next(void)
{
    static int n = 0;
    return ++n;
}

int main(void)
{
    // ترتیب ارزیابی آرگومان‌ها مشخص‌نشده (unspecified) است
    printf("%d %d\n", next(), next());
    return 0;
}
