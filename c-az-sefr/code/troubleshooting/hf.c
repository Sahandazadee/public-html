#include <stdint.h>

void hardfault_c(uint32_t *frame)
{
    volatile uint32_t stacked_pc = frame[6];
    volatile uint32_t cfsr = *(volatile uint32_t *)0xE000ED28u;
    (void)stacked_pc;
    (void)cfsr;
    for (;;) { }
}

__attribute__((naked)) void HardFault_Handler(void)
{
    __asm volatile(
        "tst lr, #4      \n"
        "ite eq          \n"
        "mrseq r0, msp   \n"
        "mrsne r0, psp   \n"
        "b hardfault_c   \n"
    );
}
