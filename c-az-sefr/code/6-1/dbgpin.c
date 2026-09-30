#include <stdint.h>

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830u)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000u)
#define GPIOA_BSRR  (*(volatile uint32_t *)0x40020018u)

#define DBG_HIGH() (GPIOA_BSRR = (1u << 6))         // PA6 = 1
#define DBG_LOW()  (GPIOA_BSRR = (1u << (6 + 16)))  // PA6 = 0

extern void process_sample(void);   // تابعی که می‌خواهیم زمانش را بسنجیم

void dbg_pin_init(void)
{
    RCC_AHB1ENR |= 1u << 0;                             // ساعت GPIOA
    GPIOA_MODER = (GPIOA_MODER & ~(3u << 12)) | (1u << 12); // PA6 خروجی
}

void measured_step(void)
{
    DBG_HIGH();
    process_sample();
    DBG_LOW();
}
