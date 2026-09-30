#include <stdint.h>

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830u)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000u)
#define GPIOA_BSRR  (*(volatile uint32_t *)0x40020018u)

void systick_init_1ms(void);
uint32_t millis(void);

int main(void)
{
    uint32_t last_blink = 0u;
    int led_on = 0;

    RCC_AHB1ENR |= 1u << 0;
    (void)RCC_AHB1ENR;
    GPIOA_MODER = (GPIOA_MODER & ~(3u << 10)) | (1u << 10);
    systick_init_1ms();

    for (;;) {
        if (millis() - last_blink >= 500u) {
            last_blink += 500u;
            led_on = !led_on;
            GPIOA_BSRR = led_on ? (1u << 5) : (1u << 21);
        }
        // اینجا می‌توان کارهای دیگر را هم انجام داد؛ حلقه بلاک نمی‌شود
    }
}
