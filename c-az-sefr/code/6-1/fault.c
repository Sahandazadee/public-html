#include <stdint.h>

/* ثبات‌های SCB: وضعیت خطاها */
#define SCB_CFSR (*(volatile uint32_t *)0xE000ED28u)
#define SCB_BFAR (*(volatile uint32_t *)0xE000ED38u)

/* volatile تا دیباگر (و کامپایلر) آن‌ها را حذف نکند */
volatile uint32_t fault_pc;
volatile uint32_t fault_lr;
volatile uint32_t fault_cfsr;
volatile uint32_t fault_bfar;

/* frame: هشت کلمه‌ای که CPU هنگام خطا روی پشته ریخته: R0 R1 R2 R3 R12 LR PC xPSR */
void hardfault_c(const uint32_t *frame)
{
    fault_lr   = frame[5];
    fault_pc   = frame[6];
    fault_cfsr = SCB_CFSR;
    fault_bfar = SCB_BFAR;
    for (;;) {
        /* اینجا می‌ایستیم تا دیباگر وصل شود */
    }
}

/* naked: بدون prologue، تا SP دست‌نخورده بماند */
__attribute__((naked)) void HardFault_Handler(void)
{
    __asm volatile (
        "tst lr, #4      \n"
        "ite eq          \n"
        "mrseq r0, msp   \n"
        "mrsne r0, psp   \n"
        "b hardfault_c   \n"
    );
}

/* برای آزمایش: خواندن از آدرسی که هیچ‌چیز آنجا نیست */
uint32_t read_missing(void)
{
    return *(volatile uint32_t *)0xA0000000u;
}

int main(void)
{
    return (int)read_missing();
}
