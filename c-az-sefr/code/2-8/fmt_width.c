#include <stdio.h>

int main(void)
{
    int v = 42;
    double t = 3.14159;

    printf("[%d]\n", v);
    printf("[%6d]\n", v);       // عرض ۶، راست‌چین
    printf("[%-6d]\n", v);      // چپ‌چین
    printf("[%06d]\n", v);      // پر کردن با صفر
    printf("[%+d]\n", v);       // علامت مثبت هم بیاید
    printf("[%.2f]\n", t);      // دو رقم اعشار
    printf("[%8.3f]\n", t);     // عرض ۸ و سه رقم اعشار
    printf("[%.3s]\n", "microcontroller");   // فقط ۳ حرف اول
    printf("[%-8s]\n", "led");
    printf("[%*d]\n", 5, v);    // عرض از آرگومان می‌آید
    printf("[%04X]\n", 0xEF);
    return 0;
}
