#ifndef MOCK_BUS_H
#define MOCK_BUS_H

#include "bus.h"

typedef struct {
    uint8_t addr7;
    uint8_t regs[256];
} mock_dev_t;

void mock_dev_init(mock_dev_t *dev, uint8_t addr7);
bus_t mock_dev_bus(mock_dev_t *dev);

#endif
