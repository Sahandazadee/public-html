#include <stdint.h>
#include <stdio.h>

#define HZ 100u

static uint32_t ms_to_ticks_floor(uint32_t ms)
{
    return ms * HZ / 1000u;
}

static uint32_t ms_to_ticks_ceil(uint32_t ms)
{
    return (ms * HZ + 999u) / 1000u;
}

int main(void)
{
    static const uint32_t list[] = { 1u, 5u, 10u, 11u, 999u };

    printf("  ms  floor  ceil\n");
    for (unsigned i = 0; i < sizeof list / sizeof list[0]; i++) {
        printf("%4u  %5u  %4u\n", (unsigned)list[i],
               (unsigned)ms_to_ticks_floor(list[i]),
               (unsigned)ms_to_ticks_ceil(list[i]));
    }
    return 0;
}
