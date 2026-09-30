#include <stdint.h>
#include <stddef.h>

typedef struct {
    volatile uint32_t CR1;
    volatile uint32_t CR2;
    volatile uint32_t SMCR;
    volatile uint32_t DIER;
    volatile uint32_t SR;
    volatile uint32_t EGR;
    volatile uint32_t CCMR1;
    volatile uint32_t CCMR2;
    volatile uint32_t CCER;
    volatile uint32_t CNT;
    volatile uint32_t PSC;
    volatile uint32_t ARR;
    uint32_t RESERVED0;
    volatile uint32_t CCR1;
} TIM_TypeDef;

#define TIM2 ((TIM_TypeDef *)0x40000000u)

_Static_assert(offsetof(TIM_TypeDef, EGR)   == 0x14, "EGR");
_Static_assert(offsetof(TIM_TypeDef, CCMR1) == 0x18, "CCMR1");
_Static_assert(offsetof(TIM_TypeDef, CCER)  == 0x20, "CCER");
_Static_assert(offsetof(TIM_TypeDef, PSC)   == 0x28, "PSC");
_Static_assert(offsetof(TIM_TypeDef, ARR)   == 0x2C, "ARR");
_Static_assert(offsetof(TIM_TypeDef, CCR1)  == 0x34, "CCR1");

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830u)
#define RCC_APB1ENR (*(volatile uint32_t *)0x40023840u)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000u)
#define GPIOA_AFRL  (*(volatile uint32_t *)0x40020020u)

void pwm_init_1khz(void)
{
    RCC_AHB1ENR |= 1u << 0;
    RCC_APB1ENR |= 1u << 0;
    (void)RCC_APB1ENR;

    GPIOA_MODER = (GPIOA_MODER & ~(3u << 10)) | (2u << 10);
    GPIOA_AFRL  = (GPIOA_AFRL & ~(0xFu << 20)) | (1u << 20);

    TIM2->PSC   = 16u - 1u;
    TIM2->ARR   = 1000u - 1u;
    TIM2->CCR1  = 0u;
    TIM2->CCMR1 = (TIM2->CCMR1 & ~(7u << 4)) | (6u << 4) | (1u << 3);
    TIM2->CCER |= 1u << 0;
    TIM2->EGR   = 1u << 0;
    TIM2->CR1  |= 1u << 0;
}

void pwm_set_permille(uint32_t permille)
{
    if (permille > 1000u) {
        permille = 1000u;
    }
    TIM2->CCR1 = permille;
}
