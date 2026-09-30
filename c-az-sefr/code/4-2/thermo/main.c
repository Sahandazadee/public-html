#include <stdio.h>
#include "sensor.h"
#include "filter.h"

int main(void)
{
    filter_reset();
    for (int i = 0; i < 5; i++) {
        int16_t raw = sensor_read_dc();
        filter_add(raw);
        int16_t avg = filter_average();
        printf("raw=%d.%d avg=%d.%d\n", raw / 10, raw % 10, avg / 10, avg % 10);
    }
    return 0;
}
