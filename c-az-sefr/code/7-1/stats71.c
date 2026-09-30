#include <stdio.h>
#include <stdint.h>
#include <stddef.h>

typedef int16_t centi_t;

typedef struct {
    centi_t min;
    centi_t max;
    centi_t avg;
} stats_t;

static stats_t compute_stats(const centi_t *v, size_t n)
{
    stats_t s = { v[0], v[0], 0 };
    int32_t sum = 0;                            /* ۳۲ بیتی: جمع ۱۶ عدد 125.00 در ۱۶ بیت جا نمی‌شود */
    for (size_t i = 0; i < n; i++) {
        if (v[i] < s.min) {
            s.min = v[i];
        }
        if (v[i] > s.max) {
            s.max = v[i];
        }
        sum += v[i];
    }
    s.avg = (centi_t)((sum + (int32_t)n / 2) / (int32_t)n);   /* گرد به نزدیک‌ترین */
    return s;
}

static centi_t naive_avg(const centi_t *v, size_t n)
{
    uint16_t sum = 0;                           /* خطا: ۱۶ بیتی */
    for (size_t i = 0; i < n; i++) {
        sum = (uint16_t)(sum + (uint16_t)v[i]);
    }
    return (centi_t)(sum / n);
}

static void show(const char *label, centi_t t)
{
    printf("%s=%d.%02d", label, t / 100, t % 100);
}

int main(void)
{
    const centi_t a[8] = { 2210, 2240, 2295, 2380, 2510, 2680, 2890, 3050 };
    centi_t hot[16];
    for (size_t i = 0; i < 16; i++) {
        hot[i] = 12500;
    }

    stats_t s = compute_stats(a, 8);
    show("min", s.min); printf(" ");
    show("max", s.max); printf(" ");
    show("avg", s.avg); printf("\n");

    show("good avg of sixteen 125.00", compute_stats(hot, 16).avg); printf("\n");
    show("bad  avg of sixteen 125.00", naive_avg(hot, 16)); printf("\n");
    return 0;
}
