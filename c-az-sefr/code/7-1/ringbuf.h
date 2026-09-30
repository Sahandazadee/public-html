#ifndef RINGBUF_H
#define RINGBUF_H

#include <stdbool.h>
#include <stdint.h>
#include "config.h"

_Static_assert((RING_CAPACITY & (RING_CAPACITY - 1u)) == 0u, "RING_CAPACITY must be a power of two");

typedef struct {
    uint32_t t_ms;                      /* لحظهٔ نمونه‌برداری */
    centi_t  centi;                     /* دما (صدم درجه) */
} sample_t;

typedef struct {
    sample_t buf[RING_CAPACITY];
    uint32_t head;                      /* شمارندهٔ نوشتن (آزادانه بالا می‌رود) */
    uint32_t tail;                      /* شمارندهٔ قدیمی‌ترین نمونه */
} ring_t;

void     ring_init(ring_t *r);
uint32_t ring_count(const ring_t *r);
bool     ring_push(ring_t *r, sample_t s);                 /* true اگر قدیمی‌ترین را دور ریخت */
bool     ring_at(const ring_t *r, uint32_t i, sample_t *out); /* i = 0 قدیمی‌ترین */

#endif /* RINGBUF_H */
