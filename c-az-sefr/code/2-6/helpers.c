#include <stdio.h>

static int clamp(int v, int lo, int hi)
{
    if (v < lo) {
        return lo;
    }
    if (v > hi) {
        return hi;
    }
    return v;
}

static int map_range(int x, int in_lo, int in_hi, int out_lo, int out_hi)
{
    return (x - in_lo) * (out_hi - out_lo) / (in_hi - in_lo) + out_lo;
}

static int celsius_to_f(int c)
{
    return c * 9 / 5 + 32;
}

int main(void)
{
    printf("clamp(150, 0, 100) = %d\n", clamp(150, 0, 100));
    printf("clamp(-7, 0, 100)  = %d\n", clamp(-7, 0, 100));
    printf("clamp(42, 0, 100)  = %d\n", clamp(42, 0, 100));
    printf("map_range(2048, 0, 4095, 0, 100) = %d\n", map_range(2048, 0, 4095, 0, 100));
    printf("celsius_to_f(100) = %d\n", celsius_to_f(100));
    return 0;
}
