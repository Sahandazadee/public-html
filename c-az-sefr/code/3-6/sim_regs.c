#include <stdio.h>
#include <stdint.h>

static volatile uint32_t fake_odr;

static void reg_set(volatile uint32_t *reg, unsigned bit)
{
    *reg |= 1u << bit;
}

static void reg_clear(volatile uint32_t *reg, unsigned bit)
{
    *reg &= ~(1u << bit);
}

static void reg_toggle(volatile uint32_t *reg, unsigned bit)
{
    *reg ^= 1u << bit;
}

int main(void)
{
    reg_set(&fake_odr, 3);
    printf("set 3    : 0x%04x\n", (unsigned)fake_odr);
    reg_set(&fake_odr, 5);
    printf("set 5    : 0x%04x\n", (unsigned)fake_odr);
    reg_toggle(&fake_odr, 3);
    printf("toggle 3 : 0x%04x\n", (unsigned)fake_odr);
    reg_clear(&fake_odr, 5);
    printf("clear 5  : 0x%04x\n", (unsigned)fake_odr);
    reg_toggle(&fake_odr, 0);
    printf("toggle 0 : 0x%04x\n", (unsigned)fake_odr);
    return 0;
}
