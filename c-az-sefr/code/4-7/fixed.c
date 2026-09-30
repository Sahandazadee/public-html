#include <stdio.h>
#include <stdint.h>

typedef int16_t q15_t;              // Q1.15: مقدار واقعی = raw / 32768
typedef int32_t q16_t;              // Q16.16: مقدار واقعی = raw / 65536

static q15_t q15_from_double(double x)
{
    double r = x * 32768.0;
    if (r >  32767.0) r =  32767.0;         // اشباع
    if (r < -32768.0) r = -32768.0;
    return (q15_t)(r < 0 ? r - 0.5 : r + 0.5);
}

static q15_t q15_mul(q15_t a, q15_t b)
{
    int32_t p = (int32_t)a * (int32_t)b;    // نتیجه Q30 است، در ۳۲ بیت جا می‌شود
    p += 1 << 14;                           // نصفِ آخرین بیتِ دورریختنی: گرد کردن
    p >>= 15;                               // برگشت به Q15
    if (p > 32767) p = 32767;               // فقط (-1)*(-1) اینجا می‌رسد
    return (q15_t)p;
}

static q16_t q16_mul(q16_t a, q16_t b)
{
    int64_t p = (int64_t)a * b;             // Q32 در ۶۴ بیت
    return (q16_t)(p >> 16);
}

static q16_t q16_div(q16_t a, q16_t b)
{
    return (q16_t)(((int64_t)a * 65536) / b);   // اول بزرگ کن، بعد تقسیم
}

int main(void)
{
    q15_t half = q15_from_double(0.5);
    q15_t neg  = q15_from_double(-0.75);
    q15_t m1   = q15_from_double(-1.0);

    printf("half = %d, neg = %d, m1 = %d\n", half, neg, m1);
    printf("0.5 * 0.5   -> raw %d\n", q15_mul(half, half));
    printf("0.5 * -0.75 -> raw %d\n", q15_mul(half, neg));
    printf("-1 * -1     -> raw %d (saturated)\n", q15_mul(m1, m1));

    q16_t a = (q16_t)(3.25 * 65536);        // 3.25
    q16_t b = (q16_t)(2.5  * 65536);        // 2.5
    q16_t c = q16_mul(a, b);                // 8.125
    printf("q16: %d * %d -> %d\n", a, b, c);
    printf("as text: %d.%03d\n", c >> 16, ((c & 0xFFFF) * 1000) >> 16);
    printf("q16: %d / %d -> %d\n", c, b, q16_div(c, b));
    return 0;
}
