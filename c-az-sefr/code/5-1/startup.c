#include <stdint.h>

extern uint32_t _sidata;            /* شروع تصویر .data در Flash */
extern uint32_t _sdata, _edata;     /* ابتدا و انتهای .data در RAM */
extern uint32_t _sbss, _ebss;       /* ابتدا و انتهای .bss در RAM */

int main(void);

static void system_init(void)
{
#if defined(__VFP_FP__) && !defined(__SOFTFP__)
    /* CPACR: دسترسی کامل به FPU (CP10 و CP11) */
    *(volatile uint32_t *)0xE000ED88u |= (0xFu << 20);
    __asm volatile ("dsb\n\tisb");
#endif
}

void Reset_Handler(void)
{
    uint32_t *src = &_sidata;
    uint32_t *dst = &_sdata;

    while (dst < &_edata) {
        *dst++ = *src++;            /* .data: از Flash به RAM */
    }
    for (dst = &_sbss; dst < &_ebss; dst++) {
        *dst = 0;                   /* .bss: صفر */
    }

    system_init();
    main();
    for (;;) { }                    /* اگر main برگشت: بایست */
}
