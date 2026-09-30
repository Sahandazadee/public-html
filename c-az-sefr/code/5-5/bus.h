#ifndef BUS_H
#define BUS_H

#include <stddef.h>
#include <stdint.h>

#define BUS_OK        0
#define BUS_ERR_NACK (-1)
#define BUS_ERR_ARG  (-2)

typedef struct {
    int (*xfer)(void *ctx, uint8_t addr7,
                const uint8_t *tx, size_t tx_len,
                uint8_t *rx, size_t rx_len);
    void *ctx;
} bus_t;

#endif
