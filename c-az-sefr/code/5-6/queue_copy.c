#include <stdint.h>
#include <stdio.h>
#include <string.h>

typedef struct { uint8_t id; int16_t value; } msg_t;

#define Q_LEN 3

typedef struct {
    msg_t slot[Q_LEN];
    unsigned head;      // جای خواندن بعدی
    unsigned count;     // تعداد پیام‌های موجود
} queue_t;

/* مثل xQueueSend: پیام را «کپی» می‌کند؛ اگر پر بود 0 برمی‌گرداند */
static int q_send(queue_t *q, const msg_t *item)
{
    if (q->count == Q_LEN) {
        return 0;
    }
    memcpy(&q->slot[(q->head + q->count) % Q_LEN], item, sizeof *item);
    q->count++;
    return 1;
}

/* مثل xQueueReceive: قدیمی‌ترین پیام را در out کپی می‌کند */
static int q_recv(queue_t *q, msg_t *out)
{
    if (q->count == 0u) {
        return 0;
    }
    memcpy(out, &q->slot[q->head], sizeof *out);
    q->head = (q->head + 1u) % Q_LEN;
    q->count--;
    return 1;
}

int main(void)
{
    queue_t q = { .head = 0u, .count = 0u };
    msg_t m = { .id = 1, .value = 100 };

    printf("send 1: %d\n", q_send(&q, &m));
    m.value = 200;                       // بعد از ارسال، نسخهٔ محلی را عوض می‌کنیم
    m.id = 2;
    printf("send 2: %d\n", q_send(&q, &m));
    m.id = 3;
    printf("send 3: %d\n", q_send(&q, &m));
    m.id = 4;
    printf("send 4: %d (queue full)\n", q_send(&q, &m));

    msg_t got;
    while (q_recv(&q, &got)) {
        printf("recv: id=%u value=%d\n", (unsigned)got.id, (int)got.value);
    }
    return 0;
}
