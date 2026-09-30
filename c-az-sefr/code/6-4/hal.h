#ifndef HAL_H
#define HAL_H

#include <stdint.h>

/* روی برد واقعی در hal_stm32.c پیاده می‌شود؛ روی PC، فایل تست تعریفش می‌کند */
void hal_delay_ms(uint32_t ms);

#endif /* HAL_H */
