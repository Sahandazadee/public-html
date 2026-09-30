#include <stdint.h>
#include <stdio.h>

#define HAL_PIN(port, n) ((uint8_t)((((port) - 'A') * 16) + (n)))

static void describe(uint8_t pin)
{
    uint32_t port = pin / 16u;
    uint32_t n = pin % 16u;
    uint32_t base = 0x40020000u + 0x400u * port;

    printf("pin %3u = GPIO%c%-2u base=0x%08X MODER bits %2u:%-2u BSRR set=0x%08X reset=0x%08X\n",
           (unsigned)pin, (char)('A' + port), (unsigned)n, (unsigned)base,
           (unsigned)(2u * n + 1u), (unsigned)(2u * n),
           (unsigned)(1u << n), (unsigned)(1u << (n + 16u)));
}

int main(void)
{
    describe(HAL_PIN('A', 5));
    describe(HAL_PIN('B', 0));
    describe(HAL_PIN('C', 13));
    describe(HAL_PIN('E', 3));
    describe(HAL_PIN('H', 1));
    return 0;
}
