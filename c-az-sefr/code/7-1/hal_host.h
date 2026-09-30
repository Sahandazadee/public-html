#ifndef HAL_HOST_H
#define HAL_HOST_H

#include "hal.h"

const hal_t *hal_host_get(void);
void         hal_host_advance(uint32_t ms);     /* ساعت ساختگی را جلو ببر */

#endif /* HAL_HOST_H */
