#include <stdio.h>
#include <stdint.h>

#define MV_EMPTY 3000
#define MV_FULL  4200

/* درصد باتری (فرض تمرینی: خطی بین ۳۰۰۰ و ۴۲۰۰ میلی‌ولت) */
static int battery_percent(int mv)
{
    if (mv <= MV_EMPTY) return 0;
    if (mv >= MV_FULL)  return 100;
    int span = MV_FULL - MV_EMPTY;
    return ((mv - MV_EMPTY) * 100 + span / 2) / span;
}

/* نسخهٔ خراب: تقسیم زودتر از ضرب */
static int battery_percent_bad(int mv)
{
    if (mv <= MV_EMPTY) return 0;
    if (mv >= MV_FULL)  return 100;
    return (mv - MV_EMPTY) / (MV_FULL - MV_EMPTY) * 100;
}

int main(void)
{
    const int test[] = { 2900, 3000, 3300, 3600, 3900, 4100, 4300 };
    for (unsigned i = 0; i < sizeof test / sizeof test[0]; i++) {
        printf("%4d mV -> %3d %%   (bad: %3d %%)\n",
               test[i], battery_percent(test[i]), battery_percent_bad(test[i]));
    }
    return 0;
}
