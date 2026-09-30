#include <stdint.h>
#include <stdio.h>

static uint16_t total;

/* اضافه می‌کند؛ اگر از حد بگذرد روی حداکثر می‌ماند (اشباع) */
static void add_sample(uint8_t sample)
{
    if (total > (uint16_t)(UINT16_MAX - sample)) {
        total = UINT16_MAX;
    } else {
        total = (uint16_t)(total + sample);
    }
}

static int half(int value, uint8_t *out)
{
    if ((out == NULL) || (value < 0) || (value > 510)) {
        return -1;
    }
    *out = (uint8_t)(value / 2);
    return 0;
}

static int get_count(void)
{
    return 3;
}

int main(void)
{
    uint8_t h = 5U;
    int st = half(10, &h);
    printf("half(10) = %u (status %d)\n", (unsigned)h, st);
    st = half(-4, &h);
    printf("half(-4) = %u (status %d)\n", (unsigned)h, st);

    for (int i = 0; i < get_count() * 100000; i++) {
        add_sample(255U);
        if (total == UINT16_MAX) {
            break;
        }
    }
    printf("total = %u (saturated)\n", (unsigned)total);
    return 0;
}
