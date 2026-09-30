#include "sat_sub.h"

uint8_t sat_sub_u8(uint8_t a, uint8_t b)
{
    if (b >= a) {
        return 0U;                  // نتیجه صفر یا منفی می‌شد
    }
    return (uint8_t)(a - b);
}
