#ifndef SIM_SENSOR_H
#define SIM_SENSOR_H

#include <stdbool.h>
#include <stdint.h>

bool sim_sensor_read(uint16_t *raw);    /* دمای ساختگی: بالا می‌رود، آلارم می‌دهد، برمی‌گردد */

#endif /* SIM_SENSOR_H */
