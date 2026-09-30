#include <stdio.h>
#include <stdint.h>

static void reg_set(uint32_t *reg, uint32_t mask)
{
    *reg |= mask;
}

static void reg_clear(uint32_t *reg, uint32_t mask)
{
    *reg &= ~mask;
}

static void reg_toggle(uint32_t *reg, uint32_t mask)
{
    *reg ^= mask;
}

int main(void)
{
    uint32_t fake_odr = 0;                  // رجیستر ساختگی روی PC

    reg_set(&fake_odr, (1U << 5) | (1U << 0));
    printf("after set    : 0x%08X\n", (unsigned)fake_odr);
    reg_clear(&fake_odr, 1U << 0);
    printf("after clear  : 0x%08X\n", (unsigned)fake_odr);
    reg_toggle(&fake_odr, 1U << 5);
    printf("after toggle : 0x%08X\n", (unsigned)fake_odr);
    reg_toggle(&fake_odr, 1U << 5);
    printf("after toggle : 0x%08X\n", (unsigned)fake_odr);
    return 0;
}
