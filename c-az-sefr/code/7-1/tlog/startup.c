#include <stdint.h>

extern uint32_t _estack, _sidata, _sdata, _edata, _sbss, _ebss;
int main(void);

void Reset_Handler(void);
void Default_Handler(void);
void NMI_Handler(void)       __attribute__((weak, alias("Default_Handler")));
void HardFault_Handler(void) __attribute__((weak, alias("Default_Handler")));
void SysTick_Handler(void)   __attribute__((weak, alias("Default_Handler")));

typedef void (*isr_t)(void);

__attribute__((section(".isr_vector"), used))
const isr_t vector_table[16] = {
    (isr_t)&_estack,            /* 0: مقدار اولیهٔ SP */
    Reset_Handler,              /* 1: نقطهٔ شروع */
    NMI_Handler,                /* 2 */
    HardFault_Handler,          /* 3 */
    0, 0, 0, 0, 0, 0, 0,       /* 4..10: خطاهای دیگر و رزرو */
    0,                          /* 11: SVC */
    0, 0, 0,                    /* 12..14 */
    SysTick_Handler             /* 15: تیک ۱ms ما */
};

void Reset_Handler(void)
{
    uint32_t *src = &_sidata;
    for (uint32_t *dst = &_sdata; dst < &_edata; ) {
        *dst++ = *src++;        /* کپی .data از Flash به RAM */
    }
    for (uint32_t *dst = &_sbss; dst < &_ebss; ) {
        *dst++ = 0u;            /* صفر کردن .bss */
    }
    main();
    for (;;) {
    }
}

void Default_Handler(void)
{
    for (;;) {
    }
}
