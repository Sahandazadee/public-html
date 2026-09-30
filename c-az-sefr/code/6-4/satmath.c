#include "satmath.h"

uint8_t sat_add_u8(uint8_t a, uint8_t b)
{
    unsigned sum = (unsigned)a + (unsigned)b;   // در نوع پهن‌تر جمع می‌کنیم
    return (sum > 255U) ? 255U : (uint8_t)sum;
}
