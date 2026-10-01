#ifndef HAL_GPIO_H
#define HAL_GPIO_H

#include <stdint.h>

/* شمارهٔ پایه = حرف پورت × ۱۶ + شمارهٔ پین؛ PA5 → 5، PC13 → 45 */
#define HAL_PIN(port, n) ((uint8_t)((((port) - 'A') * 16) + (n)))

typedef enum {
    HAL_OK = 0,
    HAL_ERR_PARAM,
    HAL_ERR_IO
} hal_status_t;

typedef enum {
    HAL_LOW = 0,
    HAL_HIGH = 1
} hal_level_t;

typedef enum {
    HAL_PULL_NONE = 0,
    HAL_PULL_UP,
    HAL_PULL_DOWN
} hal_pull_t;

/* قرارداد: هر backend این چهار تابع را می‌دهد.
   init_output: سطح اولیه را «پیش از» خروجی‌شدن پایه می‌نویسد (بدون گلیچ).
   init_input:  پایه را ورودی می‌کند و مقاومت داخلی را تنظیم می‌کند.
   read:        سطح «واقعی» پایه را می‌دهد، روی ورودی و روی خروجی. */
typedef struct {
    hal_status_t (*init_output)(uint8_t pin, hal_level_t initial);
    hal_status_t (*init_input)(uint8_t pin, hal_pull_t pull);
    hal_status_t (*write)(uint8_t pin, hal_level_t level);
    hal_status_t (*read)(uint8_t pin, hal_level_t *level);
} hal_gpio_ops_t;

#endif
