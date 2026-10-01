#include <stdint.h>

extern uint32_t _estack;            /* ساخته‌شده توسط اسکریپت لینکر */

typedef void (*isr_t)(void);

void Reset_Handler(void);
void Default_Handler(void);

/* هر وقفه‌ای که خودت ننویسی، به Default_Handler می‌رسد */
#define WEAK_ISR __attribute__((weak, alias("Default_Handler")))

/* وقفه‌ها و خطاهای هستهٔ Cortex-M */
void NMI_Handler(void) WEAK_ISR;
void HardFault_Handler(void) WEAK_ISR;
void MemManage_Handler(void) WEAK_ISR;
void BusFault_Handler(void) WEAK_ISR;
void UsageFault_Handler(void) WEAK_ISR;
void SVC_Handler(void) WEAK_ISR;
void DebugMon_Handler(void) WEAK_ISR;
void PendSV_Handler(void) WEAK_ISR;
void SysTick_Handler(void) WEAK_ISR;

/* وقفه‌های تراشهٔ STM32F411 (RM0383، جدول بردار وقفه) */
void WWDG_IRQHandler(void) WEAK_ISR;
void PVD_IRQHandler(void) WEAK_ISR;
void TAMP_STAMP_IRQHandler(void) WEAK_ISR;
void RTC_WKUP_IRQHandler(void) WEAK_ISR;
void FLASH_IRQHandler(void) WEAK_ISR;
void RCC_IRQHandler(void) WEAK_ISR;
void EXTI0_IRQHandler(void) WEAK_ISR;
void EXTI1_IRQHandler(void) WEAK_ISR;
void EXTI2_IRQHandler(void) WEAK_ISR;
void EXTI3_IRQHandler(void) WEAK_ISR;
void EXTI4_IRQHandler(void) WEAK_ISR;
void DMA1_Stream0_IRQHandler(void) WEAK_ISR;
void DMA1_Stream1_IRQHandler(void) WEAK_ISR;
void DMA1_Stream2_IRQHandler(void) WEAK_ISR;
void DMA1_Stream3_IRQHandler(void) WEAK_ISR;
void DMA1_Stream4_IRQHandler(void) WEAK_ISR;
void DMA1_Stream5_IRQHandler(void) WEAK_ISR;
void DMA1_Stream6_IRQHandler(void) WEAK_ISR;
void ADC_IRQHandler(void) WEAK_ISR;
void EXTI9_5_IRQHandler(void) WEAK_ISR;
void TIM1_BRK_TIM9_IRQHandler(void) WEAK_ISR;
void TIM1_UP_TIM10_IRQHandler(void) WEAK_ISR;
void TIM1_TRG_COM_TIM11_IRQHandler(void) WEAK_ISR;
void TIM1_CC_IRQHandler(void) WEAK_ISR;
void TIM2_IRQHandler(void) WEAK_ISR;
void TIM3_IRQHandler(void) WEAK_ISR;
void TIM4_IRQHandler(void) WEAK_ISR;
void I2C1_EV_IRQHandler(void) WEAK_ISR;
void I2C1_ER_IRQHandler(void) WEAK_ISR;
void I2C2_EV_IRQHandler(void) WEAK_ISR;
void I2C2_ER_IRQHandler(void) WEAK_ISR;
void SPI1_IRQHandler(void) WEAK_ISR;
void SPI2_IRQHandler(void) WEAK_ISR;
void USART1_IRQHandler(void) WEAK_ISR;
void USART2_IRQHandler(void) WEAK_ISR;
void EXTI15_10_IRQHandler(void) WEAK_ISR;
void RTC_Alarm_IRQHandler(void) WEAK_ISR;
void OTG_FS_WKUP_IRQHandler(void) WEAK_ISR;
void DMA1_Stream7_IRQHandler(void) WEAK_ISR;
void SDIO_IRQHandler(void) WEAK_ISR;
void TIM5_IRQHandler(void) WEAK_ISR;
void SPI3_IRQHandler(void) WEAK_ISR;
void DMA2_Stream0_IRQHandler(void) WEAK_ISR;
void DMA2_Stream1_IRQHandler(void) WEAK_ISR;
void DMA2_Stream2_IRQHandler(void) WEAK_ISR;
void DMA2_Stream3_IRQHandler(void) WEAK_ISR;
void DMA2_Stream4_IRQHandler(void) WEAK_ISR;
void OTG_FS_IRQHandler(void) WEAK_ISR;
void DMA2_Stream5_IRQHandler(void) WEAK_ISR;
void DMA2_Stream6_IRQHandler(void) WEAK_ISR;
void DMA2_Stream7_IRQHandler(void) WEAK_ISR;
void USART6_IRQHandler(void) WEAK_ISR;
void I2C3_EV_IRQHandler(void) WEAK_ISR;
void I2C3_ER_IRQHandler(void) WEAK_ISR;
void FPU_IRQHandler(void) WEAK_ISR;
void SPI4_IRQHandler(void) WEAK_ISR;
void SPI5_IRQHandler(void) WEAK_ISR;

/* جدول وقفه: ۱۶ ورودی هسته + ۸۶ وقفهٔ تراشه (شمارهٔ ۰ تا ۸۵) = ۱۰۲ کلمه */
__attribute__((section(".isr_vector"), used))
const isr_t g_vectors[102] = {
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
    /* از ورودی 16 به بعد: وقفهٔ شمارهٔ n در ورودی 16+n. جای خالی = رزرو (صفر) */
    [16 + 0] = WWDG_IRQHandler,
    [16 + 1] = PVD_IRQHandler,
    [16 + 2] = TAMP_STAMP_IRQHandler,
    [16 + 3] = RTC_WKUP_IRQHandler,
    [16 + 4] = FLASH_IRQHandler,
    [16 + 5] = RCC_IRQHandler,
    [16 + 6] = EXTI0_IRQHandler,
    [16 + 7] = EXTI1_IRQHandler,
    [16 + 8] = EXTI2_IRQHandler,
    [16 + 9] = EXTI3_IRQHandler,
    [16 + 10] = EXTI4_IRQHandler,
    [16 + 11] = DMA1_Stream0_IRQHandler,
    [16 + 12] = DMA1_Stream1_IRQHandler,
    [16 + 13] = DMA1_Stream2_IRQHandler,
    [16 + 14] = DMA1_Stream3_IRQHandler,
    [16 + 15] = DMA1_Stream4_IRQHandler,
    [16 + 16] = DMA1_Stream5_IRQHandler,
    [16 + 17] = DMA1_Stream6_IRQHandler,
    [16 + 18] = ADC_IRQHandler,
    [16 + 23] = EXTI9_5_IRQHandler,
    [16 + 24] = TIM1_BRK_TIM9_IRQHandler,
    [16 + 25] = TIM1_UP_TIM10_IRQHandler,
    [16 + 26] = TIM1_TRG_COM_TIM11_IRQHandler,
    [16 + 27] = TIM1_CC_IRQHandler,
    [16 + 28] = TIM2_IRQHandler,
    [16 + 29] = TIM3_IRQHandler,
    [16 + 30] = TIM4_IRQHandler,
    [16 + 31] = I2C1_EV_IRQHandler,
    [16 + 32] = I2C1_ER_IRQHandler,
    [16 + 33] = I2C2_EV_IRQHandler,
    [16 + 34] = I2C2_ER_IRQHandler,
    [16 + 35] = SPI1_IRQHandler,
    [16 + 36] = SPI2_IRQHandler,
    [16 + 37] = USART1_IRQHandler,
    [16 + 38] = USART2_IRQHandler,
    [16 + 40] = EXTI15_10_IRQHandler,
    [16 + 41] = RTC_Alarm_IRQHandler,
    [16 + 42] = OTG_FS_WKUP_IRQHandler,
    [16 + 47] = DMA1_Stream7_IRQHandler,
    [16 + 49] = SDIO_IRQHandler,
    [16 + 50] = TIM5_IRQHandler,
    [16 + 51] = SPI3_IRQHandler,
    [16 + 56] = DMA2_Stream0_IRQHandler,
    [16 + 57] = DMA2_Stream1_IRQHandler,
    [16 + 58] = DMA2_Stream2_IRQHandler,
    [16 + 59] = DMA2_Stream3_IRQHandler,
    [16 + 60] = DMA2_Stream4_IRQHandler,
    [16 + 67] = OTG_FS_IRQHandler,
    [16 + 68] = DMA2_Stream5_IRQHandler,
    [16 + 69] = DMA2_Stream6_IRQHandler,
    [16 + 70] = DMA2_Stream7_IRQHandler,
    [16 + 71] = USART6_IRQHandler,
    [16 + 72] = I2C3_EV_IRQHandler,
    [16 + 73] = I2C3_ER_IRQHandler,
    [16 + 81] = FPU_IRQHandler,
    [16 + 84] = SPI4_IRQHandler,
    [16 + 85] = SPI5_IRQHandler,
};

void Default_Handler(void)
{
    for (;;) { }                     /* وقفهٔ پیش‌بینی‌نشده: همین‌جا می‌ایستیم */
}
