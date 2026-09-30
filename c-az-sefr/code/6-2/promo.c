#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint8_t a = 0x0F;
    if (~a == 0xF0)                       // فکر می‌کنی درست است؟
        printf("~a == 0xF0\n");
    else
        printf("~a != 0xF0\n");
    printf("~a = 0x%X\n", (unsigned)~a);

    uint8_t hi = 0xAB;
    uint32_t word = (uint32_t)hi << 24;   // اول به 32 بیت بی‌علامت برسان، بعد شیفت بده
    printf("word = 0x%08X\n", (unsigned)word);

    uint8_t b = 200, c = 100;
    uint8_t sum = b + c;                  // محاسبه با int انجام می‌شود، ذخیره در 8 بیت
    printf("sum = %u\n", sum);
    return 0;
}
