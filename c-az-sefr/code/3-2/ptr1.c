#include <stdio.h>

int main(void)
{
    int x = 25;
    int *p = &x;            // p آدرس x را نگه می‌دارد

    printf("x  = %d\n", x);
    printf("*p = %d\n", *p);
    printf("p == &x ? %d\n", p == &x);

    *p = 99;                // از راه آدرس، x را عوض کن
    printf("x  = %d\n", x);
    printf("*p = %d\n", *p);
    return 0;
}
