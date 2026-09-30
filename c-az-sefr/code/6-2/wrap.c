#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint8_t a = 250;
    uint8_t b = 10;
    uint8_t sum8 = (uint8_t)(a + b);   // برش به 8 بیت: قانونی و تعریف‌شده
    int sum_int = a + b;               // محاسبه در int: 260
    printf("sum8 = %u\n", sum8);
    printf("sum_int = %d\n", sum_int);

    int8_t s = 120;
    int8_t t = (int8_t)(s + 10);       // 130 در int8_t جا نمی‌شود
    printf("t = %d\n", t);
    return 0;
}
