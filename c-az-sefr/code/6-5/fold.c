#include <stdint.h>

#define VREF_MV 3300u
#define ADC_MAX 4095u

uint32_t full_scale_uv(void)
{
    uint32_t mv = VREF_MV * 1000u / ADC_MAX * 2u;
    return mv + 0u * 12345u;
}
