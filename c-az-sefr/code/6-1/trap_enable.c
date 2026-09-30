#include <stdint.h>

#define SCB_CCR   (*(volatile uint32_t *)0xE000ED14u)
#define SCB_SHCSR (*(volatile uint32_t *)0xE000ED24u)

void enable_fault_traps(void)
{
    SCB_SHCSR |= (1u << 16) | (1u << 17) | (1u << 18);   // MemManage، BusFault، UsageFault فعال
    SCB_CCR   |= (1u << 4) | (1u << 3);                   // تقسیم بر صفر و ناهم‌ترازی هم خطا بدهند
}

void BusFault_Handler(void)   { for (;;) { } }
void UsageFault_Handler(void) { for (;;) { } }
void MemManage_Handler(void)  { for (;;) { } }
