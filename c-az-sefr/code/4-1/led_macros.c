#include <stdint.h>

#define BIT(n)          (1UL << (n))
#define REG32(addr)     (*(volatile uint32_t *)(addr))

#define RCC_AHB1ENR     REG32(0x40023830UL)
#define GPIOA_BASE      0x40020000UL
#define GPIOA_MODER     REG32(GPIOA_BASE + 0x00UL)
#define GPIOA_BSRR      REG32(GPIOA_BASE + 0x18UL)

#define LED_PIN         5U
#define LED_ON()        (GPIOA_BSRR = BIT(LED_PIN))
#define LED_OFF()       (GPIOA_BSRR = BIT(LED_PIN + 16U))

void led_init(void)
{
    RCC_AHB1ENR |= BIT(0);
    GPIOA_MODER &= ~(3UL << (LED_PIN * 2U));
    GPIOA_MODER |= (1UL << (LED_PIN * 2U));
}

void led_blink_once(void)
{
    LED_ON();
    LED_OFF();
}
