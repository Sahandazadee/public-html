#include <stdint.h>

static volatile uint8_t tick_flag;

void SysTick_Handler(void)
{
    tick_flag = 1u;
}

int main(void)
{
    for (;;) {
        if (tick_flag != 0u) {
            tick_flag = 0u;
            /* کار دورهای اینجا */
        }
    }
}
