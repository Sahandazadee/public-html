#include <stdio.h>
#include <stddef.h>
#include <stdint.h>

typedef struct {
    volatile uint32_t MODER;    // +0x00
    volatile uint32_t OTYPER;   // +0x04
    volatile uint32_t OSPEEDR;  // +0x08
    volatile uint32_t PUPDR;    // +0x0C
    const volatile uint32_t IDR;  // +0x10 (فقط‌خواندنی)
    volatile uint32_t ODR;      // +0x14
    volatile uint32_t BSRR;     // +0x18
    volatile uint32_t LCKR;     // +0x1C
    volatile uint32_t AFR[2];   // +0x20 و +0x24
} GPIO_TypeDef;

int main(void)
{
    printf("MODER   0x%02zx\n", offsetof(GPIO_TypeDef, MODER));
    printf("OTYPER  0x%02zx\n", offsetof(GPIO_TypeDef, OTYPER));
    printf("OSPEEDR 0x%02zx\n", offsetof(GPIO_TypeDef, OSPEEDR));
    printf("PUPDR   0x%02zx\n", offsetof(GPIO_TypeDef, PUPDR));
    printf("IDR     0x%02zx\n", offsetof(GPIO_TypeDef, IDR));
    printf("ODR     0x%02zx\n", offsetof(GPIO_TypeDef, ODR));
    printf("BSRR    0x%02zx\n", offsetof(GPIO_TypeDef, BSRR));
    printf("LCKR    0x%02zx\n", offsetof(GPIO_TypeDef, LCKR));
    printf("AFR     0x%02zx\n", offsetof(GPIO_TypeDef, AFR));
    printf("size    0x%02zx\n", sizeof(GPIO_TypeDef));
    return 0;
}
