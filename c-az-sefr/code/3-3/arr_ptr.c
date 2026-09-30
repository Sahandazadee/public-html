#include <stdio.h>

int main(void)
{
    int a[4] = {10, 20, 30, 40};
    int *p = a;                    // اشاره‌گر به عنصر اول

    printf("a[2]     = %d\n", a[2]);
    printf("*(a + 2) = %d\n", *(a + 2));
    printf("*(p + 2) = %d\n", *(p + 2));
    printf("p[2]     = %d\n", p[2]);
    printf("bytes between p and p+1: %d\n", (int)((char *)(p + 1) - (char *)p));
    printf("elements between p and p+3: %d\n", (int)((p + 3) - p));
    return 0;
}
