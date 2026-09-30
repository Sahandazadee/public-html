#include <stdio.h>

#define IRQ_COUNT 4u

typedef void (*handler_t)(void);

static int button_count = 0;

static void default_handler(void) { printf("unexpected interrupt\n"); }
static void timer_handler(void)   { printf("timer tick\n"); }
static void button_handler(void)
{
    button_count++;
    printf("button pressed (%d)\n", button_count);
}

static const handler_t vector_table[IRQ_COUNT] = {
    [1] = button_handler,
    [2] = timer_handler,
};

static void irq_fire(unsigned n)
{
    handler_t h = default_handler;

    if (n < IRQ_COUNT && vector_table[n] != NULL) {
        h = vector_table[n];
    }
    h();
}

int main(void)
{
    const unsigned events[] = {1, 2, 1, 3, 7};

    for (unsigned i = 0; i < sizeof(events) / sizeof(events[0]); i++) {
        irq_fire(events[i]);
    }
    return 0;
}
