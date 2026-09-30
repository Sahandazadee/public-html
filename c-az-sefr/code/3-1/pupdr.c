#include <stdio.h>
#include <stdint.h>

// حالت‌های PUPDR: 0 = هیچ، 1 = pull-up، 2 = pull-down
static uint32_t set_pull(uint32_t reg, unsigned pin, uint32_t pull)
{
    reg &= ~(3U << (pin * 2U));
    reg |= (pull & 3U) << (pin * 2U);
    return reg;
}

static uint32_t get_pull(uint32_t reg, unsigned pin)
{
    return (reg >> (pin * 2U)) & 3U;
}

int main(void)
{
    uint32_t pupdr = 0x64000000U;       // مقدار پس از ریست GPIOA

    pupdr = set_pull(pupdr, 0, 1U);
    pupdr = set_pull(pupdr, 7, 1U);
    pupdr = set_pull(pupdr, 3, 2U);

    printf("PUPDR = 0x%08X\n", (unsigned)pupdr);
    printf("pin 3 pull = %u\n", (unsigned)get_pull(pupdr, 3));
    printf("pin 13 pull = %u\n", (unsigned)get_pull(pupdr, 13));
    return 0;
}
