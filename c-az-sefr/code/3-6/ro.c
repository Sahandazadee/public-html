#include <stdint.h>

#define GPIOC_IDR (*(const volatile uint32_t *)0x40020810u)

int main(void)
{
    GPIOC_IDR = 0;
    return 0;
}
