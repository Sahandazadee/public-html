#include <stdio.h>

int main(void)
{
    int table[4] = {10, 20, 30, 40};
    int sum = 0;

    for (int i = 0; i <= 4; i++)     // خطا: i تا ۴ می‌رود، ولی آخرین ایندکس ۳ است
        sum += table[i];

    printf("sum = %d\n", sum);
    return 0;
}
