#include "rb_policy.h"

bool rb_put_overwrite(ringbuf_t *rb, uint8_t byte)
{
    bool lost = false;

    if (rb_is_full(rb)) {
        rb->tail++;                         // قدیمی‌ترین بایت دور ریخته شد
        lost = true;
    }
    rb->data[rb->head & RB_MASK] = byte;
    rb->head++;
    return !lost;
}
