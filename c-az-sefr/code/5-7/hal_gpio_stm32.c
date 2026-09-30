#include "hal_gpio_stm32.h"

#include <stddef.h>

#define REG32(addr)      (*(volatile uint32_t *)(addr))
#define RCC_AHB1ENR      REG32(0x40023830u)
#define GPIO_BASE(port)  (0x40020000u + 0x400u * (port))
#define GPIO_MODER(port) REG32(GPIO_BASE(port) + 0x00u)
#define GPIO_IDR(port)   REG32(GPIO_BASE(port) + 0x10u)
#define GPIO_BSRR(port)  REG32(GPIO_BASE(port) + 0x18u)

#define MAX_PORT 4u                     /* GPIOA تا GPIOE */

static hal_status_t stm32_init_output(uint8_t pin)
{
    uint32_t port = pin / 16u;
    uint32_t n = pin % 16u;

    if (port > MAX_PORT) {
        return HAL_ERR_PARAM;
    }
    RCC_AHB1ENR |= (1u << port);            /* ساعت پورت را روشن کن */
    (void)RCC_AHB1ENR;                      /* خواندن ساختگی: تأخیر کوتاه */
    GPIO_MODER(port) = (GPIO_MODER(port) & ~(3u << (2u * n)))
                     | (1u << (2u * n));    /* 01 = خروجی */
    return HAL_OK;
}

static hal_status_t stm32_write(uint8_t pin, hal_level_t level)
{
    uint32_t port = pin / 16u;
    uint32_t n = pin % 16u;

    if (port > MAX_PORT) {
        return HAL_ERR_PARAM;
    }
    GPIO_BSRR(port) = (level == HAL_HIGH) ? (1u << n) : (1u << (n + 16u));
    return HAL_OK;
}

static hal_status_t stm32_read(uint8_t pin, hal_level_t *level)
{
    uint32_t port = pin / 16u;

    if (port > MAX_PORT || level == NULL) {
        return HAL_ERR_PARAM;
    }
    *level = ((GPIO_IDR(port) >> (pin % 16u)) & 1u) ? HAL_HIGH : HAL_LOW;
    return HAL_OK;
}

const hal_gpio_ops_t hal_gpio_stm32_ops = {
    .init_output = stm32_init_output,
    .write = stm32_write,
    .read = stm32_read,
};
