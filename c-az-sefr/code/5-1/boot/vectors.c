#include <stdint.h>

extern uint32_t _estack;            /* ساخته‌شده توسط اسکریپت لینکر */

typedef void (*isr_t)(void);

void Reset_Handler(void);
void Default_Handler(void);

/* هر وقفه‌ای که خودت ننویسی، به Default_Handler می‌رسد */
void NMI_Handler(void)          __attribute__((weak, alias("Default_Handler")));
void HardFault_Handler(void)    __attribute__((weak, alias("Default_Handler")));
void MemManage_Handler(void)    __attribute__((weak, alias("Default_Handler")));
void BusFault_Handler(void)     __attribute__((weak, alias("Default_Handler")));
void UsageFault_Handler(void)   __attribute__((weak, alias("Default_Handler")));
void SVC_Handler(void)          __attribute__((weak, alias("Default_Handler")));
void DebugMon_Handler(void)     __attribute__((weak, alias("Default_Handler")));
void PendSV_Handler(void)       __attribute__((weak, alias("Default_Handler")));
void SysTick_Handler(void)      __attribute__((weak, alias("Default_Handler")));
void EXTI15_10_IRQHandler(void) __attribute__((weak, alias("Default_Handler")));

/* جدول وقفه: ۱۶ ورودی هسته + ۴۱ وقفهٔ اول تراشه (تا EXTI15_10) */
__attribute__((section(".isr_vector"), used))
const isr_t g_vectors[57] = {
    (isr_t)&_estack,                 /* 0: مقدار اولیهٔ SP */
    Reset_Handler,                   /* 1: کجا شروع کنم؟ */
    NMI_Handler,                     /* 2 */
    HardFault_Handler,               /* 3 */
    MemManage_Handler,               /* 4 */
    BusFault_Handler,                /* 5 */
    UsageFault_Handler,              /* 6 */
    0, 0, 0, 0,                      /* 7..10: رزرو */
    SVC_Handler,                     /* 11 */
    DebugMon_Handler,                /* 12 */
    0,                               /* 13: رزرو */
    PendSV_Handler,                  /* 14 */
    SysTick_Handler,                 /* 15 */
    [16 ... 55] = Default_Handler,   /* وقفه‌های 0 تا 39 تراشه */
    [56] = EXTI15_10_IRQHandler,     /* وقفهٔ 40 */
};

void Default_Handler(void)
{
    for (;;) { }                     /* وقفهٔ پیش‌بینی‌نشده: همین‌جا می‌ایستیم */
}
