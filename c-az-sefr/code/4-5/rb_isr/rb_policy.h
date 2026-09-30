#ifndef RB_POLICY_H
#define RB_POLICY_H

#include "ringbuf.h"

/* اگر پر بود، قدیمی‌ترین بایت را دور می‌ریزد. true یعنی چیزی از دست نرفت. */
bool rb_put_overwrite(ringbuf_t *rb, uint8_t byte);

#endif /* RB_POLICY_H */
