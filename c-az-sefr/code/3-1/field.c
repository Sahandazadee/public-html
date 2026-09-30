#include <stdio.h>
#include <stdint.h>

// n بیت کم‌ارزش (برای n کمتر از 32)
#define MASK(n) ((1U << (n)) - 1U)

static uint32_t get_field(uint32_t reg, unsigned lo, unsigned width)
{
    return (reg >> lo) & MASK(width);
}

static uint32_t set_field(uint32_t reg, unsigned lo, unsigned width, uint32_t value)
{
    reg &= ~(MASK(width) << lo);            // اول جای فیلد را پاک کن
    reg |= (value & MASK(width)) << lo;     // بعد مقدار را بگذار
    return reg;
}

int main(void)
{
    uint32_t reg = 0xB6;                    // 1011 0110

    printf("reg        = 0x%02X\n", (unsigned)reg);
    printf("bits 6..4  = %u\n", (unsigned)get_field(reg, 4, 3));
    reg = set_field(reg, 4, 3, 2U);
    printf("after set  = 0x%02X\n", (unsigned)reg);
    reg = set_field(reg, 4, 3, 9U);
    printf("value 9 cut= 0x%02X\n", (unsigned)reg);
    return 0;
}
