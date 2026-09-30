#ifndef SENSOR_H
#define SENSOR_H

#include <stdint.h>

/* دمای شبیه‌سازی‌شده بر حسب دهم درجه: 235 یعنی 23.5 درجه */
int16_t sensor_read_dc(void);

#endif /* SENSOR_H */
