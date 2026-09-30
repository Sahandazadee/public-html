#include <stdint.h>

uint32_t swap32(uint32_t x)
{
    return  (x << 24)
          | ((x & 0x0000FF00u) << 8)
          | ((x >> 8) & 0x0000FF00u)
          |  (x >> 24);
}

unsigned ones(uint32_t x)
{
    return (unsigned)__builtin_popcount(x);     // تعداد بیت‌های ۱
}
