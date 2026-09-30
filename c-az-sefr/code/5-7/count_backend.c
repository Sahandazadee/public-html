#include <stdio.h>

typedef struct {
    void (*write)(int pin, int level);
} gpio_ops_t;

static unsigned s_calls;

static void count_write(int pin, int level)
{
    (void)pin;
    (void)level;
    s_calls++;
}

static void log_write(int pin, int level)
{
    printf("pin %d <- %d\n", pin, level);
}

static const gpio_ops_t count_ops = { count_write };
static const gpio_ops_t log_ops = { log_write };

static void blink_n(const gpio_ops_t *gpio, int pin, int times)
{
    for (int i = 0; i < times; i++) {
        gpio->write(pin, 1);
        gpio->write(pin, 0);
    }
}

int main(void)
{
    blink_n(&log_ops, 5, 2);
    blink_n(&count_ops, 5, 3);
    printf("count backend saw %u writes\n", s_calls);
    return 0;
}
