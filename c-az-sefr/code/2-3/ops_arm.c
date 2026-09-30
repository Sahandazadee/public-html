#include <stdint.h>

uint16_t adc_to_mv(uint16_t adc)
{
    return (uint16_t)(((uint32_t)adc * 3300U) / 4095U);
}

uint32_t second_of_minute(uint32_t uptime_s)
{
    return uptime_s % 60U;
}
