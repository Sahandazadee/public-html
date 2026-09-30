#include <stdio.h>

int main(void)
{
    const int max_temp = 80;
    max_temp = 90;              // خطا! قفسه قفل است
    printf("%d\n", max_temp);
    return 0;
}
