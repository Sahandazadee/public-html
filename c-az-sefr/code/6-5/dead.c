#include <stdint.h>

#define DEBUG 0

static uint32_t helper(uint32_t x)
{
    return x * 3u + 1u;
}

uint32_t run(uint32_t x)
{
    uint32_t y = helper(x);
    if (DEBUG) {
        y = y * 7u;
    }
    return y;
}
