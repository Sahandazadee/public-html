#include <stdint.h>

extern uint32_t _estack, _sidata, _sdata, _edata, _sbss, _ebss;
int main(void);

void Reset_Handler(void);
void Default_Handler(void);
void NMI_Handler(void)       __attribute__((weak, alias("Default_Handler")));
void HardFault_Handler(void) __attribute__((weak, alias("Default_Handler")));

__attribute__((section(".isr_vector"), used))
void (*const vector_table[])(void) = {
    (void (*)(void))&_estack,   // کلمهٔ ۰: مقدار اولیهٔ SP
    Reset_Handler,              // کلمهٔ ۱: نقطهٔ شروع
    NMI_Handler,                // کلمهٔ ۲
    HardFault_Handler,          // کلمهٔ ۳
};

void Reset_Handler(void)
{
    uint32_t *src = &_sidata;
    for (uint32_t *dst = &_sdata; dst < &_edata; ) {
        *dst++ = *src++;
    }
    for (uint32_t *dst = &_sbss; dst < &_ebss; ) {
        *dst++ = 0u;
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
