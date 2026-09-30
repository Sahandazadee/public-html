#include <stdio.h>

int main(void)
{
    int a = 5;
    int b = a;          // کپی مقدار فعلی a
    a = 9;              // فقط a عوض می‌شود
    printf("a = %d, b = %d\n", a, b);
    return 0;
}
