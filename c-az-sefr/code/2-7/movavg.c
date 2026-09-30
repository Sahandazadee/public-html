#include <stdio.h>
#include <stdint.h>

#define WINDOW 4

int main(void)
{
    const uint16_t adc[6] = {100, 200, 300, 400, 500, 600};
    uint16_t window[WINDOW] = {0};
    int next = 0;

    for (int i = 0; i < 6; i++) {
        window[next] = adc[i];
        next = (next + 1) % WINDOW;

        uint32_t sum = 0;
        for (int k = 0; k < WINDOW; k++) {
            sum += window[k];
        }
        printf("sample %d: raw=%3u  avg=%3u\n", i, (unsigned)adc[i], (unsigned)(sum / WINDOW));
    }
    return 0;
}
