#include <stdio.h>
#include <stdint.h>
#include <math.h>

/* sin(0..90 درجه) هر ۱۰ درجه، در قالب Q15 (۳۲۷۶۷ = ۱٫۰) */
static const int16_t sin_tab[10] = {
    0, 5690, 11207, 16383, 21062, 25101, 28377, 30791, 32269, 32767
};

/* زاویه ۰ تا ۹۰ درجه؛ بین دو نقطهٔ جدول خطی درون‌یابی می‌کند */
static int16_t sin_q15(uint8_t deg)
{
    if (deg >= 90u) {
        return sin_tab[9];                  /* از انتهای جدول بیرون نزنیم */
    }
    uint8_t  i    = deg / 10u;              /* کدام بازه */
    uint8_t  frac = deg % 10u;              /* چند دهم راه رفته‌ایم (۰ تا ۹) */
    int32_t  y0   = sin_tab[i];
    int32_t  y1   = sin_tab[i + 1];
    return (int16_t)(y0 + (y1 - y0) * frac / 10);
}

int main(void)
{
    const uint8_t test[] = { 0, 5, 15, 30, 45, 60, 89, 90 };
    for (unsigned k = 0; k < sizeof test; k++) {
        printf("deg=%2u  table=%5d  exact=%7.1f\n", (unsigned)test[k],
               sin_q15(test[k]), 32767.0 * sin(test[k] * 3.14159265358979 / 180.0));
    }

    int maxerr = 0;
    for (uint8_t d = 0; d <= 90; d++) {
        int e = (int)(sin_q15(d) - 32767.0 * sin(d * 3.14159265358979 / 180.0));
        if (e < 0) e = -e;
        if (e > maxerr) maxerr = e;
    }
    printf("max error = %d of 32767\n", maxerr);
    return 0;
}
