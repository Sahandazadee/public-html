#ifndef LOGGER_H
#define LOGGER_H

#include <stdbool.h>
#include <stdint.h>
#include "config.h"
#include "hal.h"
#include "parser.h"
#include "ringbuf.h"

typedef enum {
    LG_IDLE,                            /* نمونه نمی‌گیرد */
    LG_SAMPLING,                        /* هر SAMPLE_PERIOD_MS یک نمونه */
    LG_ALARM                            /* نمونه می‌گیرد و دما از آستانه بالاتر است */
} lg_state_t;

typedef struct {
    lg_state_t   state;
    const hal_t *hal;
    parser_t     parser;
    ring_t       ring;
    uint32_t     last_sample_ms;
    uint32_t     total;                 /* تعداد کل نمونه‌های گرفته‌شده */
    centi_t      high;                  /* آستانهٔ آلارم */
} logger_t;

void        logger_init(logger_t *lg, const hal_t *hal);
void        logger_poll(logger_t *lg);  /* در هر دور حلقهٔ اصلی صدا زده می‌شود */
const char *logger_state_name(lg_state_t s);

#endif /* LOGGER_H */
