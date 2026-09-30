#include <stdio.h>
#include <stdint.h>

/* تقسیم صحیح با گرد کردن به نزدیک‌ترین (برای اعداد مثبت) */
static uint32_t div_round(uint32_t n, uint32_t d)
{
    return (n + d / 2u) / d;
}

/* نسخهٔ علامت‌دار: نیم را در جهت علامت نتیجه اضافه می‌کنیم */
static int32_t div_round_s(int32_t n, int32_t d)
{
    return (((n < 0) == (d < 0)) ? (n + d / 2) : (n - d / 2)) / d;
}

int main(void)
{
    printf("7 / 2          = %d\n", 7 / 2);
    printf("-7 / 2         = %d\n", -7 / 2);
    printf("-7 >> 1        = %d\n", -7 >> 1);
    printf("7u >> 1        = %u\n", 7u >> 1);
    printf("div_round(7,2) = %u\n", (unsigned)div_round(7, 2));
    printf("div_round(9,4) = %u\n", (unsigned)div_round(9, 4));
    printf("div_round_s(-7,2) = %d\n", div_round_s(-7, 2));
    printf("div_round_s(-9,4) = %d\n", div_round_s(-9, 4));

    /* درصد: مقدار 3 از 8 */
    uint32_t v = 3u, mx = 8u;
    printf("pct trunc = %u, pct round = %u\n",
           (unsigned)(v * 100u / mx), (unsigned)div_round(v * 100u, mx));
    return 0;
}
