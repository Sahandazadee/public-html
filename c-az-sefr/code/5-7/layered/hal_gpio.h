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

/* قرارداد: هر backend این سه تابع را می‌دهد */
typedef struct {
    hal_status_t (*init_output)(uint8_t pin);
    hal_status_t (*write)(uint8_t pin, hal_level_t level);
    hal_status_t (*read)(uint8_t pin, hal_level_t *level);
} hal_gpio_ops_t;

#endif
