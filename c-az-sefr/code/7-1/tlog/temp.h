#ifndef TEMP_H
#define TEMP_H

#include <stddef.h>
#include <stdint.h>
#include "config.h"

centi_t temp_from_raw(uint16_t raw);                       /* عدد ADC به صدم درجه */
size_t  temp_format(char *buf, size_t size, centi_t t);    /* "23.45" یا "-5.07" */
size_t  u32_to_dec(char *buf, size_t size, uint32_t v);    /* عدد به متن ده‌دهی */

#endif /* TEMP_H */
