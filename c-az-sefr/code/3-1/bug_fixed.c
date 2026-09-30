#include <stdio.h>
#include <stdint.h>

#define BIT(n) (1U << (n))

int main(void)
{
    uint8_t status = 0x0A;              // 00001010: بیت‌های ۱ و ۳ روشن

    if ((status & BIT(3)) != 0U) {
        printf("bit 3 is set\n");
    } else {
        printf("bit 3 is NOT set\n");
    }

    if (status & BIT(3)) {
        printf("bit 3 test again: set\n");
    } else {
        printf("bit 3 test again: NOT set\n");
    }

    status &= ~BIT(1);                  // بیت ۱ را خاموش کن
    printf("status = 0x%02X\n", (unsigned)status);
    return 0;
}
