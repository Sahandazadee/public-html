#include <stdint.h>
#include <stdio.h>

#define COUNT 5U

_Static_assert(COUNT > 0U, "COUNT must be positive");

static const int readings[COUNT] = { 10, 20, 30, 40, 50 };

static int max_of(void)
{
    int best = readings[0];             // مقدار اولیهٔ معتبر
    for (unsigned i = 1U; i < COUNT; i++) {
        if (readings[i] > best) {
            best = readings[i];
        }
    }
    return best;
}

static int is_zero(int x)
{
    if (x == 0) {                       // مقایسه، نه انتساب
        return 1;
    }
    return 0;
}

int main(void)
{
    printf("%d %d\n", max_of(), is_zero(3));
    return 0;
}
