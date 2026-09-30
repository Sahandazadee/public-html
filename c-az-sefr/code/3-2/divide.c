#include <stdio.h>

// نتیجه‌ها از راه اشاره‌گر برمی‌گردند؛ مقدار برگشتی «وضعیت» است
static int divide(int a, int b, int *quotient, int *remainder)
{
    if (b == 0 || quotient == NULL || remainder == NULL) {
        return -1;
    }
    *quotient = a / b;
    *remainder = a % b;
    return 0;
}

int main(void)
{
    int q = 0;
    int r = 0;

    if (divide(17, 5, &q, &r) == 0) {
        printf("17 / 5 = %d remainder %d\n", q, r);
    }
    if (divide(1, 0, &q, &r) != 0) {
        printf("divide by zero rejected\n");
    }
    if (divide(1, 1, NULL, &r) != 0) {
        printf("NULL pointer rejected\n");
    }
    return 0;
}
