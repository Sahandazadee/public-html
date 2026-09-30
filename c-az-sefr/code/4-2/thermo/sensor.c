#include "sensor.h"

static const int16_t samples[] = { 231, 236, 229, 240, 233 };
static unsigned next_index = 0;

int16_t sensor_read_dc(void)
{
    int16_t value = samples[next_index];
    next_index = (next_index + 1U) % (sizeof(samples) / sizeof(samples[0]));
    return value;
}
