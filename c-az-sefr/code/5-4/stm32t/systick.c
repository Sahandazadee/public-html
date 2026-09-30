#include <stdint.h>
#include <stddef.h>

typedef struct {
    volatile uint32_t CTRL;
    volatile uint32_t LOAD;
    volatile uint32_t VAL;
    const volatile uint32_t CALIB;
} SysTick_Type;

#define SysTick ((SysTick_Type *)0xE000E010u)

_Static_assert(offsetof(SysTick_Type, LOAD) == 0x04, "LOAD must be at +4");
_Static_assert(offsetof(SysTick_Type, VAL)  == 0x08, "VAL must be at +8");

#define SYSTICK_ENABLE    (1u << 0)
#define SYSTICK_TICKINT   (1u << 1)
#define SYSTICK_CLKSOURCE (1u << 2)

#define CPU_HZ 16000000u

static volatile uint32_t g_ticks;

void SysTick_Handler(void)
{
    g_ticks++;
}

uint32_t millis(void)
{
    return g_ticks;
}

void systick_init_1ms(void)
{
    SysTick->CTRL = 0u;
    SysTick->LOAD = CPU_HZ / 1000u - 1u;
    SysTick->VAL  = 0u;
    SysTick->CTRL = SYSTICK_CLKSOURCE | SYSTICK_TICKINT | SYSTICK_ENABLE;
}
