#include <stdio.h>
#include <limits.h>

int main(void)
{
    volatile int v = INT_MAX;   // volatile: مقدار در زمان کامپایل معلوم نشود
    int a = v;
    int b = a + 1;              // سرریز علامت‌دار: رفتار تعریف‌نشده
    if (b > a)
        printf("b > a : the world is normal\n");
    else
        printf("b <= a : wrapped around\n");
    return 0;
}
