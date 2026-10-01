#ifndef STM32F4_H
#define STM32F4_H

#include <stdint.h>
#include <stddef.h>

typedef struct {
    volatile uint32_t MODER;    // +0x00
    volatile uint32_t OTYPER;   // +0x04
    volatile uint32_t OSPEEDR;  // +0x08
    volatile uint32_t PUPDR;    // +0x0C
    const volatile uint32_t IDR; // +0x10 (فقط‌خواندنی)
    volatile uint32_t ODR;      // +0x14
    volatile uint32_t BSRR;     // +0x18
    volatile uint32_t LCKR;     // +0x1C
    volatile uint32_t AFR[2];   // +0x20, +0x24
} GPIO_TypeDef;

typedef struct {
    volatile uint32_t CR;       // +0x00
    volatile uint32_t PLLCFGR;  // +0x04
    volatile uint32_t CFGR;     // +0x08
    volatile uint32_t CIR;      // +0x0C
    volatile uint32_t AHB1RSTR; // +0x10
    volatile uint32_t AHB2RSTR; // +0x14
    uint32_t RESERVED0[2];      // +0x18, +0x1C
    volatile uint32_t APB1RSTR; // +0x20
    volatile uint32_t APB2RSTR; // +0x24
    uint32_t RESERVED1[2];      // +0x28, +0x2C
    volatile uint32_t AHB1ENR;  // +0x30
} RCC_TypeDef;

#define RCC   ((RCC_TypeDef *)0x40023800u)
#define GPIOA ((GPIO_TypeDef *)0x40020000u)
#define GPIOC ((GPIO_TypeDef *)0x40020800u)

#define RCC_AHB1ENR_GPIOAEN (1u << 0)
#define RCC_AHB1ENR_GPIOCEN (1u << 2)

_Static_assert(offsetof(GPIO_TypeDef, IDR) == 0x10, "IDR offset");
_Static_assert(offsetof(GPIO_TypeDef, BSRR) == 0x18, "BSRR offset");
_Static_assert(offsetof(RCC_TypeDef, AHB1ENR) == 0x30, "AHB1ENR offset");

#endif /* STM32F4_H */
