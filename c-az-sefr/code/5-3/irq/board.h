#ifndef BOARD_H
#define BOARD_H

#include <stdint.h>
#include <stddef.h>

typedef struct {
    volatile uint32_t MODER, OTYPER, OSPEEDR, PUPDR;   // +0x00..+0x0C
    volatile uint32_t IDR, ODR, BSRR, LCKR;            // +0x10..+0x1C
    volatile uint32_t AFR[2];                          // +0x20, +0x24
} GPIO_TypeDef;

typedef struct {
    volatile uint32_t CR, PLLCFGR, CFGR, CIR;          // +0x00..+0x0C
    volatile uint32_t AHB1RSTR, AHB2RSTR;              // +0x10, +0x14
    uint32_t RESERVED0[2];                             // +0x18, +0x1C
    volatile uint32_t APB1RSTR, APB2RSTR;              // +0x20, +0x24
    uint32_t RESERVED1[2];                             // +0x28, +0x2C
    volatile uint32_t AHB1ENR, AHB2ENR;                // +0x30, +0x34
    uint32_t RESERVED2[2];                             // +0x38, +0x3C
    volatile uint32_t APB1ENR, APB2ENR;                // +0x40, +0x44
} RCC_TypeDef;

typedef struct {
    volatile uint32_t MEMRMP, PMC;                     // +0x00, +0x04
    volatile uint32_t EXTICR[4];                       // +0x08..+0x14
} SYSCFG_TypeDef;

typedef struct {
    volatile uint32_t IMR, EMR, RTSR, FTSR, SWIER, PR; // +0x00..+0x14
} EXTI_TypeDef;

#define RCC    ((RCC_TypeDef *)0x40023800u)
#define GPIOA  ((GPIO_TypeDef *)0x40020000u)
#define GPIOC  ((GPIO_TypeDef *)0x40020800u)
#define SYSCFG ((SYSCFG_TypeDef *)0x40013800u)
#define EXTI   ((EXTI_TypeDef *)0x40013C00u)

#define NVIC_ISER ((volatile uint32_t *)0xE000E100u)   /* فعال‌سازی */
#define NVIC_IPR  ((volatile uint8_t *)0xE000E400u)    /* اولویت، یک بایت برای هر وقفه */

#define RCC_AHB1ENR_GPIOAEN (1u << 0)
#define RCC_AHB1ENR_GPIOCEN (1u << 2)
#define RCC_APB2ENR_SYSCFGEN (1u << 14)

#define EXTI15_10_IRQn 40u

_Static_assert(offsetof(RCC_TypeDef, APB2ENR) == 0x44, "APB2ENR offset");
_Static_assert(offsetof(SYSCFG_TypeDef, EXTICR) == 0x08, "EXTICR offset");
_Static_assert(offsetof(EXTI_TypeDef, PR) == 0x14, "PR offset");

static inline void nvic_enable(uint32_t irq)
{
    NVIC_ISER[irq >> 5] = 1u << (irq & 31u);
}

static inline void nvic_set_priority(uint32_t irq, uint8_t prio)
{
    NVIC_IPR[irq] = (uint8_t)(prio << 4);
}

static inline void irq_disable(void) { __asm volatile ("cpsid i" ::: "memory"); }
static inline void irq_enable(void)  { __asm volatile ("cpsie i" ::: "memory"); }
static inline void wait_for_irq(void) { __asm volatile ("wfi"); }

#endif /* BOARD_H */
