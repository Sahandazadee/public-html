#include <stdint.h>

typedef struct {
    int (*write)(uint8_t pin, int level);
} gpio_ops_t;

static void my_write(uint8_t pin, int level)
{
    (void)pin;
    (void)level;
}

static const gpio_ops_t ops = { .write = my_write };

int main(void)
{
    return ops.write == 0;
}
