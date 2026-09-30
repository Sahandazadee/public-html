#include <stdint.h>

extern uint32_t _sidata;        // شروع مقدارهای اولیه در Flash
extern uint32_t _sdata;         // شروع .data در RAM
extern uint32_t _edata;         // پایان .data در RAM
extern uint32_t _sbss;          // شروع .bss
extern uint32_t _ebss;          // پایان .bss

int main(void);

void Reset_Handler(void)
{
    uint32_t *src = &_sidata;
    uint32_t *dst = &_sdata;
    while (dst < &_edata) {
        *dst++ = *src++;        // کپی از Flash به RAM
    }
    for (dst = &_sbss; dst < &_ebss; dst++) {
        *dst = 0;               // صفر کردن .bss
    }
    main();
    for (;;) { }
}
