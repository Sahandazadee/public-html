#include "mock_bus.h"

#include <stdio.h>
#include <string.h>

static int mock_xfer(void *ctx, uint8_t addr7,
                     const uint8_t *tx, size_t tx_len,
                     uint8_t *rx, size_t rx_len)
{
    mock_dev_t *dev = ctx;

    if (addr7 != dev->addr7) {
        printf("[bus] 0x%02X: no ACK\n", addr7);
        return BUS_ERR_NACK;
    }
    if (tx_len == 0u) {
        return BUS_ERR_ARG;
    }

    uint8_t reg = tx[0];
    printf("[bus] 0x%02X: write %u byte(s), read %u byte(s), reg 0x%02X\n",
           addr7, (unsigned)tx_len, (unsigned)rx_len, reg);

    for (size_t i = 1; i < tx_len; i++) {
        dev->regs[(uint8_t)(reg + i - 1u)] = tx[i];
    }
    for (size_t i = 0; i < rx_len; i++) {
        rx[i] = dev->regs[(uint8_t)(reg + i)];
    }
    return BUS_OK;
}

void mock_dev_init(mock_dev_t *dev, uint8_t addr7)
{
    memset(dev, 0, sizeof *dev);
    dev->addr7 = addr7;
    dev->regs[0xD0] = 0x60u;
    dev->regs[0xFA] = 0x7Eu;
    dev->regs[0xFB] = 0xEDu;
    dev->regs[0xFC] = 0x00u;
}

bus_t mock_dev_bus(mock_dev_t *dev)
{
    bus_t bus = { mock_xfer, dev };
    return bus;
}
