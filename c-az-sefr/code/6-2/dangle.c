#include <stdio.h>

static int *make_counter(void)
{
    int counter = 5;
    return &counter;            // آدرس متغیر محلی: بعد از return دیگر معتبر نیست
}

int main(void)
{
    int *p = make_counter();
    printf("%d\n", *p);
    return 0;
}
