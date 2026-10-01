#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint16_t a = 65535, b = 65535;

    /* a * b به‌تنهایی: هر دو به int (علامت‌دار ۳۲ بیتی) ارتقا می‌یابند و جا نمی‌شود = UB */
    uint32_t good = (uint32_t)a * b;        // یک طرف را قبل از ضرب پهن کن
    printf("good = %lu\n", (unsigned long)good);

    int i = -1;
    unsigned u = 1u;
    printf("-1 < 1u : %d\n", i < u);        // -1 به unsigned تبدیل می‌شود

    size_t n = 3;
    for (size_t k = n; k-- > 0; ) {         // شمارش معکوس امن با بی‌علامت
        printf("k=%zu\n", k);
    }
    return 0;
}
