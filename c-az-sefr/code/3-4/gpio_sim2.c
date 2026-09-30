#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

typedef struct {
    volatile uint32_t MODER;
    volatile uint32_t OTYPER;
    volatile uint32_t OSPEEDR;
    volatile uint32_t PUPDR;
    volatile uint32_t IDR;
    volatile uint32_t ODR;
    volatile uint32_t BSRR;
} gpio_sim_t;

_Static_assert(offsetof(gpio_sim_t, ODR) == 0x14, "ODR must be at 0x14");

static gpio_sim_t fake_gpioa;
#define GPIOA (&fake_gpioa)

int main(void)
{
    GPIOA->ODR |= (1u << 5);
    printf("ODR after set    = 0x%08X\n", (unsigned)GPIOA->ODR);
    GPIOA->ODR ^= (1u << 5);
    printf("ODR after toggle = 0x%08X\n", (unsigned)GPIOA->ODR);
    return 0;
}
