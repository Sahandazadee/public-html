#include "filter.h"

#define WINDOW 3U

static int16_t window[WINDOW];
static unsigned count = 0;
static unsigned head = 0;

void filter_reset(void)
{
    count = 0;
    head = 0;
}

void filter_add(int16_t value)
{
    window[head] = value;
    head = (head + 1U) % WINDOW;
    if (count < WINDOW) {
        count++;
    }
}

int16_t filter_average(void)
{
    int32_t sum = 0;
    if (count == 0) {
        return 0;
    }
    for (unsigned i = 0; i < count; i++) {
        sum += window[i];
    }
    return (int16_t)(sum / (int32_t)count);
}
