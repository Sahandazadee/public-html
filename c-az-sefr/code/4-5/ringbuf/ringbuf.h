#ifndef RINGBUF_H
#define RINGBUF_H

#include <stdbool.h>
#include <stdint.h>

#ifndef RB_SIZE
#define RB_SIZE 8U              /* ظرفیت بافر؛ باید توان ۲ باشد */
#endif
#define RB_MASK (RB_SIZE - 1U)

_Static_assert(RB_SIZE >= 2U && (RB_SIZE & RB_MASK) == 0U && RB_SIZE <= 32768U,
               "RB_SIZE must be a power of two, 2..32768");

typedef struct {
    volatile uint8_t  data[RB_SIZE];
    volatile uint16_t head;     /* شمارندهٔ نوشتن: فقط تولیدکننده عوضش می‌کند */
    volatile uint16_t tail;     /* شمارندهٔ خواندن: فقط مصرف‌کننده عوضش می‌کند */
} ringbuf_t;

void     rb_init(ringbuf_t *rb);
uint16_t rb_count(const ringbuf_t *rb);
bool     rb_is_empty(const ringbuf_t *rb);
bool     rb_is_full(const ringbuf_t *rb);
bool     rb_put(ringbuf_t *rb, uint8_t byte);
bool     rb_get(ringbuf_t *rb, uint8_t *out);

#endif /* RINGBUF_H */
