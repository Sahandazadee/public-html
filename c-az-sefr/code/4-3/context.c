#include <stdio.h>

typedef void (*visit_fn)(int value, void *ctx);

typedef struct {
    int sum;
    int max;
} stats_t;

static void update_stats(int value, void *ctx)
{
    stats_t *s = ctx;               // برگرداندن void * به نوع واقعی
    s->sum += value;
    if (value > s->max) {
        s->max = value;
    }
}

static void for_each(const int *items, int count, visit_fn fn, void *ctx)
{
    for (int i = 0; i < count; i++) {
        fn(items[i], ctx);
    }
}

int main(void)
{
    const int data[5] = {3, 8, 1, 6, 4};
    stats_t stats = {0, data[0]};

    for_each(data, 5, update_stats, &stats);
    printf("sum=%d max=%d\n", stats.sum, stats.max);
    return 0;
}
