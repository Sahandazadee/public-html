#include <stdio.h>
#include "ringbuf.h"

static ringbuf_t rx;

static void show(const char *what)
{
    printf("%-10s count=%u head=%u tail=%u\n", what,
           (unsigned)rb_count(&rx), (unsigned)rx.head, (unsigned)rx.tail);
}

int main(void)
{
    uint8_t b;

    printf("sizeof(ringbuf_t) = %zu\n", sizeof(ringbuf_t));
    rb_init(&rx);
    show("init");

    for (char c = 'A'; c <= 'E'; c++) {
        rb_put(&rx, (uint8_t)c);
    }
    show("put A-E");

    printf("get x3:   ");
    for (int i = 0; i < 3; i++) {
        if (rb_get(&rx, &b)) {
            printf("%c ", b);
        }
    }
    printf("\n");
    show("after get");

    for (char c = 'F'; c <= 'K'; c++) {
        rb_put(&rx, (uint8_t)c);
    }
    show("put F-K");

    if (!rb_put(&rx, 'L')) {
        printf("put L -> rejected (full)\n");
    }

    printf("get all:  ");
    while (rb_get(&rx, &b)) {
        printf("%c ", b);
    }
    printf("\n");
    show("drained");

    if (!rb_get(&rx, &b)) {
        printf("get -> nothing (empty)\n");
    }
    return 0;
}
