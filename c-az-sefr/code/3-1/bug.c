#include <stdio.h>
#include <stdint.h>

#define BIT(n) (1U << (n))

int main(void)
{
    uint8_t status = 0x0A;              // 00001010: بیت‌های ۱ و ۳ روشن

    if (status & 0x08 == 0x08) {
        printf("bit 3 is set\n");
    } else {
        printf("bit 3 is NOT set\n");
    }

    if ((status & BIT(3)) == 1) {
        printf("bit 3 test again: set\n");
    } else {
        printf("bit 3 test again: NOT set\n");
    }

    status &= BIT(1);                   // می‌خواستیم بیت ۱ را خاموش کنیم
    printf("status = 0x%02X\n", (unsigned)status);
    return 0;
}
