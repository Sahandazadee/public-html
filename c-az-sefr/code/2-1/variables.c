#include <stdio.h>

int main(void)
{
    int age = 25;       // ساختن متغیر و مقدار اولیه دادن
    int year;           // فقط ساختن (هنوز مقدار معتبر ندارد!)
    year = 2026;        // بعدا مقدار دادن

    printf("age = %d\n", age);
    printf("year = %d\n", year);

    age = age + 1;      // مقدار قدیمی را بخوان، یکی اضافه کن، برگردان
    printf("next age = %d\n", age);
    return 0;
}
