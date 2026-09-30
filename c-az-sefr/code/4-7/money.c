#include <stdio.h>

int main(void)
{
    double a = 0.1;
    double b = 0.2;
    printf("float:  0.1 + 0.2 == 0.3 ? %s\n", (a + b == 0.3) ? "yes" : "no");

    int a_cent = 10;                 // ۰٫۱۰ به‌صورت ده سنت
    int b_cent = 20;                 // ۰٫۲۰ به‌صورت بیست سنت
    printf("cents:  10 + 20 == 30 ? %s\n", (a_cent + b_cent == 30) ? "yes" : "no");
    return 0;
}
