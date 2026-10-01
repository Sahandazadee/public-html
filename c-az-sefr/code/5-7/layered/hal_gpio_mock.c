#include "hal_gpio_mock.h"

#include <stdio.h>

#define MOCK_PINS 80u                   /* پورت‌های A تا E */

static hal_level_t s_level[MOCK_PINS];
static uint8_t s_is_output[MOCK_PINS];
static unsigned s_writes;
static int s_fail;

static char port_of(uint8_t pin) { return (char)('A' + pin / 16u); }

static hal_status_t mock_init_output(uint8_t pin, hal_level_t initial)
{
    if (pin >= MOCK_PINS) {
        return HAL_ERR_PARAM;
    }
    s_level[pin] = initial;
    s_is_output[pin] = 1u;
    printf("[mock] P%c%u = output, starts %s\n", port_of(pin),
           (unsigned)(pin % 16u), initial == HAL_HIGH ? "HIGH" : "LOW");
    return HAL_OK;
}

static hal_status_t mock_init_input(uint8_t pin, hal_pull_t pull)
{
    if (pin >= MOCK_PINS) {
        return HAL_ERR_PARAM;
    }
    s_is_output[pin] = 0u;
    s_level[pin] = (pull == HAL_PULL_UP) ? HAL_HIGH : HAL_LOW;
    printf("[mock] P%c%u = input\n", port_of(pin), (unsigned)(pin % 16u));
    return HAL_OK;
}

static hal_status_t mock_write(uint8_t pin, hal_level_t level)
{
    if (pin >= MOCK_PINS || !s_is_output[pin]) {
        return HAL_ERR_PARAM;
    }
    if (s_fail) {
        return HAL_ERR_IO;
    }
    s_level[pin] = level;
    s_writes++;
    printf("[mock] P%c%u <- %s\n", port_of(pin), (unsigned)(pin % 16u),
           level == HAL_HIGH ? "HIGH" : "LOW");
    return HAL_OK;
}

static hal_status_t mock_read(uint8_t pin, hal_level_t *level)
{
    if (pin >= MOCK_PINS || level == NULL) {
        return HAL_ERR_PARAM;
    }
    *level = s_level[pin];
    return HAL_OK;
}

const hal_gpio_ops_t hal_gpio_mock_ops = {
    .init_output = mock_init_output,
    .init_input = mock_init_input,
    .write = mock_write,
    .read = mock_read,
};

hal_level_t hal_gpio_mock_level(uint8_t pin) { return s_level[pin]; }
unsigned hal_gpio_mock_write_count(void)     { return s_writes; }
void hal_gpio_mock_fail_writes(int enable)   { s_fail = enable; }
void hal_gpio_mock_set_input(uint8_t pin, hal_level_t level) { s_level[pin] = level; }
