#include <stdint.h>

typedef void (*isr_t)(void);

extern uint32_t _estack;                // آدرس پایان RAM؛ linker script می‌سازد

void Reset_Handler(void);
void Default_Handler(void);
void NMI_Handler(void)       __attribute__((weak, alias("Default_Handler")));
void HardFault_Handler(void) __attribute__((weak, alias("Default_Handler")));

__attribute__((section(".isr_vector"), used))
const isr_t vector_table[] = {
    (isr_t)(uintptr_t)&_estack,         // کلمهٔ ۰: SP اولیه
    Reset_Handler,                      // کلمهٔ ۱
    NMI_Handler,                        // کلمهٔ ۲
    HardFault_Handler,                  // کلمهٔ ۳
};

void Default_Handler(void)
{
    for (;;) { }                        // وقفهٔ بی‌صاحب: همین‌جا بمان
}
