#include <stdint.h>

volatile uint64_t ticks;

static inline uint32_t irq_save(void)
{
    uint32_t primask;
    __asm volatile ("mrs %0, primask\n\tcpsid i" : "=r" (primask) : : "memory");
    return primask;
}

static inline void irq_restore(uint32_t primask)
{
    __asm volatile ("msr primask, %0" : : "r" (primask) : "memory");
}

uint64_t read_ticks(void)
{
    uint32_t saved = irq_save();
    uint64_t copy = ticks;
    irq_restore(saved);
    return copy;
}
