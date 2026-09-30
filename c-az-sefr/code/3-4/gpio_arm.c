#include <stddef.h>
#include <stdint.h>

typedef struct {
    volatile uint32_t MODER;        // +0x00
    volatile uint32_t OTYPER;       // +0x04
    volatile uint32_t OSPEEDR;      // +0x08
    volatile uint32_t PUPDR;        // +0x0C
    volatile uint32_t IDR;          // +0x10
    volatile uint32_t ODR;          // +0x14
    volatile uint32_t BSRR;         // +0x18
    volatile uint32_t LCKR;         // +0x1C
    volatile uint32_t AFR[2];       // +0x20
} gpio_regs_t;

_Static_assert(offsetof(gpio_regs_t, ODR) == 0x14, "ODR offset");
_Static_assert(offsetof(gpio_regs_t, BSRR) == 0x18, "BSRR offset");
_Static_assert(sizeof(gpio_regs_t) == 0x28, "gpio size");

#define GPIOA ((gpio_regs_t *)0x40020000u)

void led_toggle(void)
{
    GPIOA->ODR ^= (1u << 5);        // PA5 = LD2
}
