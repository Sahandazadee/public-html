#include <stdio.h>

int main(void)
{
    printf("2 & 4  = %d\n", 2 & 4);     // بیتی: 010 و 100 هیچ بیت مشترکی ندارند
    printf("2 && 4 = %d\n", 2 && 4);    // منطقی: هر دو غیرصفرند
    return 0;
}
