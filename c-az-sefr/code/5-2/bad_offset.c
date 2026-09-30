#include <stdint.h>
#include <stddef.h>

typedef struct {
    volatile uint32_t MODER;
    volatile uint32_t OTYPER;
    volatile uint32_t PUPDR;    // OSPEEDR جا افتاده!
    volatile uint32_t IDR;
    volatile uint32_t ODR;
    volatile uint32_t BSRR;
} GPIO_TypeDef;

_Static_assert(offsetof(GPIO_TypeDef, BSRR) == 0x18, "BSRR offset");

int main(void)
{
    return 0;
}
