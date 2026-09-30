#include <stdio.h>
#include <stdint.h>

#ifndef WIN
#define WIN 4U                  // اندازهٔ پنجره
#endif

static int16_t win[WIN];
static unsigned idx = 0;        // خانهٔ بعدی برای نوشتن
static unsigned filled = 0;     // چند خانه تا حالا پر شده

static int16_t avg_add(int16_t sample)
{
    win[idx] = sample;
    idx = (idx + 1U) % WIN;
    if (filled < WIN) {
        filled++;
    }

    int32_t sum = 0;
    for (unsigned i = 0; i < filled; i++) {
        sum += win[i];
    }
    return (int16_t)(sum / (int32_t)filled);
}

int main(void)
{
    const int16_t samples[] = { 100, 120, 110, 130, 500, 90, 100 };

    for (unsigned i = 0; i < sizeof(samples) / sizeof(samples[0]); i++) {
        printf("in=%3d avg=%d\n", samples[i], avg_add(samples[i]));
    }
    return 0;
}
