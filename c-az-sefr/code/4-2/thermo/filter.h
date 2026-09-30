#ifndef FILTER_H
#define FILTER_H

#include <stdint.h>

void filter_reset(void);
void filter_add(int16_t value);
int16_t filter_average(void);

#endif /* FILTER_H */
