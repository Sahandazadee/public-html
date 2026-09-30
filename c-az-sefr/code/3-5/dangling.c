#include <stdio.h>

int *make_number(void)
{
    int n = 42;                 // محلی: با برگشتن تابع می‌میرد
    return &n;                  // آدرس چیزی که دارد می‌میرد!
}

int main(void)
{
    int *p = make_number();
    printf("%d\n", *p);
    return 0;
}
