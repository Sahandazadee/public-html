#include <stdint.h>
#include <stdio.h>

int main(void)
{
    uint32_t clocks[] = { 16000000u, 48000000u, 100000000u };

    for (unsigned i = 0; i < sizeof clocks / sizeof clocks[0]; i++) {
        uint32_t hz = clocks[i];
        uint32_t load = hz / 1000u - 1u;
        uint32_t max_ms = 16777216u / (hz / 1000u);

        printf("%9u Hz: LOAD = %6u, %s, max period = %u ms\n",
               (unsigned)hz, (unsigned)load,
               load <= 0xFFFFFFu ? "fits 24 bits" : "TOO BIG",
               (unsigned)max_ms);
    }
    return 0;
}
