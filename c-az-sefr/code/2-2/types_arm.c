#include <stdint.h>

_Static_assert(sizeof(int) == 4, "int must be 32 bits");
_Static_assert(sizeof(long) == 4, "long must be 32 bits");
_Static_assert(sizeof(void *) == 4, "pointers must be 32 bits");
_Static_assert(sizeof(float) == 4, "float must be 32 bits");
_Static_assert(sizeof(double) == 8, "double must be 64 bits");

uint16_t adc_average(uint16_t a, uint16_t b)
{
    uint32_t sum = (uint32_t)a + b;
    return (uint16_t)(sum / 2U);
}
