#include "bme.h"

void bme_init(bme_t *dev, const bus_t *bus, uint8_t addr7)
{
    dev->bus = bus;
    dev->addr7 = addr7;
}

static bme_status_t read_regs(bme_t *dev, uint8_t reg, uint8_t *buf, size_t len)
{
    int rc = dev->bus->xfer(dev->bus->ctx, dev->addr7, &reg, 1u, buf, len);
    return (rc == BUS_OK) ? BME_OK : BME_ERR_BUS;
}

bme_status_t bme_check_id(bme_t *dev)
{
    uint8_t id = 0u;
    bme_status_t st = read_regs(dev, BME_REG_ID, &id, 1u);

    if (st != BME_OK) {
        return st;
    }
    return (id == BME_CHIP_ID) ? BME_OK : BME_ERR_ID;
}

bme_status_t bme_trigger_forced(bme_t *dev)
{
    const uint8_t tx[2] = { BME_REG_CTRL_MEAS, 0x25u };
    int rc = dev->bus->xfer(dev->bus->ctx, dev->addr7, tx, sizeof tx, NULL, 0u);
    return (rc == BUS_OK) ? BME_OK : BME_ERR_BUS;
}

bme_status_t bme_read_temp_raw(bme_t *dev, int32_t *raw)
{
    uint8_t b[3];
    bme_status_t st = read_regs(dev, BME_REG_TEMP_MSB, b, sizeof b);

    if (st != BME_OK) {
        return st;
    }
    *raw = ((int32_t)b[0] << 12) | ((int32_t)b[1] << 4) | ((int32_t)b[2] >> 4);
    return BME_OK;
}
