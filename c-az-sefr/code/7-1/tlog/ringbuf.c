#include "ringbuf.h"

#define RING_MASK (RING_CAPACITY - 1u)

void ring_init(ring_t *r)
{
    r->head = 0u;
    r->tail = 0u;
}

uint32_t ring_count(const ring_t *r)
{
    return r->head - r->tail;           /* با سرریز بدون‌علامت هم درست است */
}

bool ring_push(ring_t *r, sample_t s)
{
    bool dropped = false;
    if (ring_count(r) == RING_CAPACITY) {
        r->tail++;                      /* جا نیست: قدیمی‌ترین را دور بریز */
        dropped = true;
    }
    r->buf[r->head & RING_MASK] = s;
    r->head++;
    return dropped;
}

bool ring_at(const ring_t *r, uint32_t i, sample_t *out)
{
    if (i >= ring_count(r)) {
        return false;
    }
    *out = r->buf[(r->tail + i) & RING_MASK];
    return true;
}
