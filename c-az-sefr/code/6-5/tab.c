#include <stdint.h>

#ifdef TABLE_CONST
const
#endif
uint16_t curve[16] = {
    0, 12, 40, 90, 160, 250, 360, 490, 640, 810, 1000, 1210, 1440, 1690, 1960, 2250
};

uint16_t lookup(uint32_t i)
{
    return curve[i & 15u];
}
