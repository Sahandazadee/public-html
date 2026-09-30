#include "sensor.h"
#include "hal.h"
#include <stddef.h>

sensor_status_t sensor_probe(const bus_ops_t *bus)
{
    if ((bus == NULL) || (bus->read_reg == NULL)) {
        return SENSOR_ERR_ARG;
    }
    for (unsigned attempt = 0U; attempt < SENSOR_RETRIES; attempt++) {
        uint8_t id = 0U;
        if (bus->read_reg(bus->ctx, SENSOR_ADDR, SENSOR_REG_ID, &id) == 0) {
            return (id == SENSOR_CHIP_ID) ? SENSOR_OK : SENSOR_ERR_ID;
        }
        if ((attempt + 1U) < SENSOR_RETRIES) {
            hal_delay_ms(SENSOR_RETRY_DELAY_MS);    // قبل از تلاش بعدی کمی صبر
        }
    }
    return SENSOR_ERR_BUS;
}
