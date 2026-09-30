#include "hal_stm32.h"
#include "sim_sensor.h"

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830u)
#define RCC_APB1ENR (*(volatile uint32_t *)0x40023840u)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000u)
#define GPIOA_BSRR  (*(volatile uint32_t *)0x40020018u)
#define GPIOA_AFRL  (*(volatile uint32_t *)0x40020020u)
#define USART2_SR   (*(volatile uint32_t *)0x40004400u)
#define USART2_DR   (*(volatile uint32_t *)0x40004404u)
#define USART2_BRR  (*(volatile uint32_t *)0x40004408u)
#define USART2_CR1  (*(volatile uint32_t *)0x4000440Cu)
#define SYST_CSR    (*(volatile uint32_t *)0xE000E010u)
#define SYST_RVR    (*(volatile uint32_t *)0xE000E014u)
#define SYST_CVR    (*(volatile uint32_t *)0xE000E018u)

#define SR_RXNE     (1u << 5)
#define SR_TXE      (1u << 7)
#define CR1_RE      (1u << 2)
#define CR1_TE      (1u << 3)
#define CR1_UE      (1u << 13)
#define LED_PIN     5u                          /* LD2 روی Nucleo = PA5 */
#define CPU_HZ      16000000u                   /* HSI پیش‌فرض */
#define BAUD        115200u

static volatile uint32_t g_ms;

void SysTick_Handler(void)
{
    g_ms++;                                     /* هر ۱ms یک بار */
}

static uint32_t stm_millis(void)
{
    return g_ms;                                /* خواندن ۳۲ بیتی روی Cortex-M اتمیک است */
}

static void stm_led(bool on)
{
    GPIOA_BSRR = on ? (1u << LED_PIN) : (1u << (LED_PIN + 16u));
}

static void stm_write(const char *s)
{
    for (; *s != '\0'; s++) {
        while ((USART2_SR & SR_TXE) == 0u) {
        }
        USART2_DR = (uint32_t)(uint8_t)*s;
    }
}

static bool stm_getc(char *c)
{
    if ((USART2_SR & SR_RXNE) == 0u) {
        return false;
    }
    *c = (char)(USART2_DR & 0xFFu);             /* خواندن DR پرچم RXNE را پاک می‌کند */
    return true;
}

static const hal_t stm_hal = {
    sim_sensor_read, stm_write, stm_getc, stm_led, stm_millis
};

const hal_t *hal_stm32_init(void)
{
    RCC_AHB1ENR |= 1u << 0;                     /* ساعت GPIOA */
    RCC_APB1ENR |= 1u << 17;                    /* ساعت USART2 */
    (void)RCC_APB1ENR;                          /* خواندن برگشتی: صبر تا ساعت برسد */

    GPIOA_MODER = (GPIOA_MODER & ~((3u << 4) | (3u << 6) | (3u << 10)))
                | (2u << 4) | (2u << 6)         /* PA2, PA3 = تابع جایگزین */
                | (1u << 10);                   /* PA5 = خروجی */
    GPIOA_AFRL  = (GPIOA_AFRL & ~((0xFu << 8) | (0xFu << 12))) | (7u << 8) | (7u << 12);

    USART2_BRR = (CPU_HZ + BAUD / 2u) / BAUD;   /* 139 = 0x8B */
    USART2_CR1 = CR1_UE | CR1_TE | CR1_RE;

    SYST_CSR = 0u;
    SYST_RVR = CPU_HZ / 1000u - 1u;             /* ۱ms */
    SYST_CVR = 0u;
    SYST_CSR = 7u;                              /* ENABLE | TICKINT | CLKSOURCE */
    return &stm_hal;
}
