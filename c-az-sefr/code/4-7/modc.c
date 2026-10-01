#include <stdio.h>
#include <limits.h>

int main(void)
{
    int a = -7, b = 2;

    printf("C      : %d / %d = %d, %d %% %d = %d\n", a, b, a / b, a, b, a % b);
    printf("check  : (a/b)*b + a%%b = %d\n", (a / b) * b + a % b);

    int py_mod = ((a % b) + b) % b;         // مثل Python، برای b مثبت
    printf("py-like: %d\n", py_mod);

    printf("INT_MIN = %d\n", INT_MIN);
    return 0;
}
