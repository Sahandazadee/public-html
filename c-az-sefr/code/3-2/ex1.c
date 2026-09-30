#include <stdio.h>

int main(void)
{
    int a = 10;
    int b = 20;
    int *p = &a;
    int *q = &b;

    *p = *q;        // مقدار b را در a کپی کن
    q = p;          // حالا q هم به a اشاره می‌کند
    *q = 5;         // a را عوض کن

    printf("a = %d, b = %d\n", a, b);
    printf("*p = %d, *q = %d\n", *p, *q);
    printf("p == q ? %d\n", p == q);
    return 0;
}
