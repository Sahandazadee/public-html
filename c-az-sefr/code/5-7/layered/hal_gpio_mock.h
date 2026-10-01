#ifndef HAL_GPIO_MOCK_H
#define HAL_GPIO_MOCK_H

#include "hal_gpio.h"

extern const hal_gpio_ops_t hal_gpio_mock_ops;

/* دریچه‌های آزمون: فقط برای تست‌ها */
hal_level_t hal_gpio_mock_level(uint8_t pin);
unsigned hal_gpio_mock_write_count(void);
void hal_gpio_mock_fail_writes(int enable);
void hal_gpio_mock_set_input(uint8_t pin, hal_level_t level);

#endif
