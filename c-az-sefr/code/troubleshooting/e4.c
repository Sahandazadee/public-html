#include <stdint.h>

static void store(uint8_t *dst) { *dst = 1; }

int main(void)
{
    uint32_t value = 0;
    store(&value);
    return (int)value;
}
