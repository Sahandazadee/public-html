#include "conv.h"

int celsius_to_f(int c)
{
    return c * 9 / 5 + 32;
}

int clamp_int(int v, int lo, int hi)
{
    if (v < lo) {
        return lo;
    }
    if (v > hi) {
        return hi;
    }
    return v;
}
