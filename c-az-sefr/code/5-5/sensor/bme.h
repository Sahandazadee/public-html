#ifndef BME_H
#define BME_H

#include "bus.h"

#define BME_REG_ID           0xD0u
#define BME_REG_CTRL_HUM     0xF2u
#define BME_REG_STATUS       0xF3u
#define BME_REG_CTRL_MEAS    0xF4u
#define BME_REG_TEMP_MSB     0xFAu
#define BME_CHIP_ID          0x60u
#define BME_STATUS_MEASURING (1u << 3)
#define BME_RAW_SKIPPED      0x80000

typedef enum {
    BME_OK = 0,
    BME_ERR_BUS,
    BME_ERR_ID,
    BME_ERR_TIMEOUT,
    BME_ERR_NODATA
} bme_status_t;

typedef struct {
    const bus_t *bus;
    uint8_t addr7;
    void (*delay_ms)(uint32_t ms);
} bme_t;

void bme_init(bme_t *dev, const bus_t *bus, uint8_t addr7);
bme_status_t bme_check_id(bme_t *dev);
bme_status_t bme_trigger_forced(bme_t *dev);
bme_status_t bme_wait_ready(bme_t *dev, unsigned max_polls);
bme_status_t bme_read_temp_raw(bme_t *dev, int32_t *raw);

#endif
