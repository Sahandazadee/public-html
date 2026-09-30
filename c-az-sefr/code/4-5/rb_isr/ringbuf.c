#include "ringbuf.h"

void rb_init(ringbuf_t *rb)
{
    rb->head = 0;
    rb->tail = 0;
}

uint16_t rb_count(const ringbuf_t *rb)
{
    return (uint16_t)(rb->head - rb->tail);
}

bool rb_is_empty(const ringbuf_t *rb)
{
    return rb->head == rb->tail;
}

bool rb_is_full(const ringbuf_t *rb)
{
    return rb_count(rb) == RB_SIZE;
}

bool rb_put(ringbuf_t *rb, uint8_t byte)
{
    if (rb_is_full(rb)) {
        return false;                       // جا نیست؛ بایت جدید را نمی‌پذیریم
    }
    rb->data[rb->head & RB_MASK] = byte;    // اول داده را بنویس
    rb->head++;                             // بعد اعلام کن که تازه چیزی آمده
    return true;
}

bool rb_get(ringbuf_t *rb, uint8_t *out)
{
    if (rb_is_empty(rb)) {
        return false;
    }
    *out = rb->data[rb->tail & RB_MASK];    // اول داده را بردار
    rb->tail++;                             // بعد جا را آزاد اعلام کن
    return true;
}
