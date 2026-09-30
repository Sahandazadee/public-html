#include <stdint.h>

typedef struct {
    volatile uint32_t MODER;
    volatile uint32_t OTYPER;
    volatile uint32_t OSPEEDR;
    volatile uint32_t PUPDR;
    const volatile uint32_t IDR;
    volatile uint32_t ODR;
    volatile uint32_t BSRR;
    volatile uint32_t LCKR;
    volatile uint32_t AFR[2];
} GPIO_TypeDef;

typedef struct {
    volatile uint32_t CR;
    volatile uint32_t PLLCFGR;
    volatile uint32_t CFGR;
    volatile uint32_t CIR;
    volatile uint32_t AHB1RSTR;
    volatile uint32_t AHB2RSTR;
    uint32_t RESERVED0[2];
    volatile uint32_t APB1RSTR;
    volatile uint32_t APB2RSTR;
    uint32_t RESERVED1[2];
    volatile uint32_t AHB1ENR;
} RCC_TypeDef;

#define RCC   ((RCC_TypeDef *)0x40023800u)
#define GPIOA ((GPIO_TypeDef *)0x40020000u)

static void delay(void)
{
    for (volatile uint32_t i = 0; i < 400000u; i++) {
    }
}

int main(void)
{
    RCC->AHB1ENR |= 1u << 0;
    (void)RCC->AHB1ENR;
    GPIOA->MODER = (GPIOA->MODER & ~(3u << 10)) | (1u << 10);

    for (;;) {
        GPIOA->BSRR = 1u << 5;
        delay();
        GPIOA->BSRR = 1u << 21;
        delay();
    }
}
