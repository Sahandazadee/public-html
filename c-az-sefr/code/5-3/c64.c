#include <stdint.h>

volatile uint64_t ticks;   // ISR هر بار یکی اضافه می‌کند

uint64_t read_ticks(void)
{
    return ticks;
}
