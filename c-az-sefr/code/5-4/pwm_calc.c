#include <stdint.h>
#include <stdio.h>

#define TIM_CLK 16000000u

static void calc(const char *what, uint32_t freq_hz, uint32_t psc, uint32_t high_permille)
{
    uint32_t tick_hz = TIM_CLK / (psc + 1u);
    uint32_t arr = tick_hz / freq_hz - 1u;
    uint32_t ccr = (arr + 1u) * high_permille / 1000u;

    printf("%-10s PSC=%2u ARR=%5u CCR1=%5u\n", what,
           (unsigned)psc, (unsigned)arr, (unsigned)ccr);
}

int main(void)
{
    calc("1kHz 25%", 1000u, 15u, 250u);
    calc("20kHz 25%", 20000u, 0u, 250u);
    calc("servo 1.5ms", 50u, 15u, 75u);
    return 0;
}
