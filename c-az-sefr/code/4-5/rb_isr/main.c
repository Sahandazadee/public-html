#include <stdio.h>
#include "ringbuf.h"
#include "rb_policy.h"

typedef struct {
    uint8_t arrive;     // چند بایت در این لحظه از سیم می‌رسد
    uint8_t consume;    // main در این لحظه فرصت دارد چند بایت بردارد
} tick_t;

static const tick_t timeline[] = {
    {2, 2}, {2, 2}, {4, 0}, {4, 0}, {3, 1}, {0, 6}, {0, 6}
};
#define TICKS (sizeof(timeline) / sizeof(timeline[0]))

static ringbuf_t rx;
static volatile uint8_t next_byte;      // شمارندهٔ بایت‌های رسیده: 1، 2، 3، ...
static volatile uint16_t lost;          // تعداد بایت‌های از دست‌رفته

/* نقش ISR: وقتی بایتی از سیم می‌رسد، سخت‌افزار این تابع را صدا می‌زند */
static void uart_rx_isr(bool overwrite)
{
    uint8_t byte = ++next_byte;
    bool ok = overwrite ? rb_put_overwrite(&rx, byte) : rb_put(&rx, byte);
    if (!ok) {
        lost++;
    }
}

static void simulate(bool overwrite)
{
    uint8_t b;

    rb_init(&rx);
    next_byte = 0;
    lost = 0;
    for (unsigned t = 0; t < TICKS; t++) {
        for (uint8_t i = 0; i < timeline[t].arrive; i++) {
            uart_rx_isr(overwrite);
        }
        printf("t=%u arrive=%u consume=%u | ", t, (unsigned)timeline[t].arrive,
               (unsigned)timeline[t].consume);
        for (uint8_t i = 0; i < timeline[t].consume && rb_get(&rx, &b); i++) {
            printf("%u ", (unsigned)b);
        }
        printf("| count=%u lost=%u\n", (unsigned)rb_count(&rx), (unsigned)lost);
    }
}

int main(void)
{
    printf("policy: drop newest\n");
    simulate(false);
    printf("policy: overwrite oldest\n");
    simulate(true);
    return 0;
}
