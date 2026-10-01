#include <stdint.h>

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830u)
#define RCC_APB1ENR (*(volatile uint32_t *)0x40023840u)

#define GPIOB_MODER (*(volatile uint32_t *)0x40020400u)
#define GPIOB_BSRR  (*(volatile uint32_t *)0x40020418u)
#define GPIOB_AFRH  (*(volatile uint32_t *)0x40020424u)

#define SPI2_CR1    (*(volatile uint32_t *)0x40003800u)
#define SPI2_SR     (*(volatile uint32_t *)0x40003808u)
#define SPI2_DR     (*(volatile uint32_t *)0x4000380Cu)

#define CR1_MSTR    (1u << 2)
#define CR1_BR_DIV16 (3u << 3)
#define CR1_SPE     (1u << 6)
#define CR1_SSI     (1u << 8)
#define CR1_SSM     (1u << 9)

#define SR_RXNE     (1u << 0)
#define SR_TXE      (1u << 1)
#define SR_BSY      (1u << 7)

#define CS_PIN      12u

void spi2_init(void)
{
    RCC_AHB1ENR |= 1u << 1;
    RCC_APB1ENR |= 1u << 14;
    (void)RCC_APB1ENR;

    GPIOB_BSRR = 1u << CS_PIN;
    GPIOB_AFRH = (GPIOB_AFRH & ~0xFFF00000u) | 0x55500000u;
    GPIOB_MODER = (GPIOB_MODER & ~0xFF000000u) | 0xA9000000u;

    SPI2_CR1 = CR1_BR_DIV16 | CR1_SSM | CR1_SSI | CR1_MSTR;
    SPI2_CR1 |= CR1_SPE;
}

void spi2_cs_low(void)
{
    GPIOB_BSRR = 1u << (CS_PIN + 16u);
}

void spi2_cs_high(void)
{
    while ((SPI2_SR & SR_BSY) != 0u) {
    }
    GPIOB_BSRR = 1u << CS_PIN;
}

uint8_t spi2_xfer(uint8_t out)
{
    while ((SPI2_SR & SR_TXE) == 0u) {
    }
    SPI2_DR = out;
    while ((SPI2_SR & SR_RXNE) == 0u) {
    }
    return (uint8_t)SPI2_DR;
}
