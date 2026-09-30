#include <stdint.h>

#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830u)
#define RCC_APB1ENR (*(volatile uint32_t *)0x40023840u)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000u)
#define GPIOA_AFRL  (*(volatile uint32_t *)0x40020020u)

#define USART2_SR   (*(volatile uint32_t *)0x40004400u)
#define USART2_DR   (*(volatile uint32_t *)0x40004404u)
#define USART2_BRR  (*(volatile uint32_t *)0x40004408u)
#define USART2_CR1  (*(volatile uint32_t *)0x4000440Cu)

#define SR_RXNE (1u << 5)
#define SR_TC   (1u << 6)
#define SR_TXE  (1u << 7)
#define CR1_RE  (1u << 2)
#define CR1_TE  (1u << 3)
#define CR1_UE  (1u << 13)

#define PCLK1_HZ 16000000u

void uart_init(uint32_t baud)
{
    RCC_AHB1ENR |= 1u << 0;
    RCC_APB1ENR |= 1u << 17;
    (void)RCC_APB1ENR;

    GPIOA_MODER = (GPIOA_MODER & ~((3u << 4) | (3u << 6))) | (2u << 4) | (2u << 6);
    GPIOA_AFRL  = (GPIOA_AFRL & ~((0xFu << 8) | (0xFu << 12))) | (7u << 8) | (7u << 12);

    USART2_BRR = (PCLK1_HZ + baud / 2u) / baud;
    USART2_CR1 = CR1_UE | CR1_TE | CR1_RE;
}

void uart_putc(char c)
{
    while ((USART2_SR & SR_TXE) == 0u) {
    }
    USART2_DR = (uint32_t)(uint8_t)c;
}

void uart_puts(const char *s)
{
    while (*s != '\0') {
        uart_putc(*s);
        s++;
    }
    while ((USART2_SR & SR_TC) == 0u) {
    }
}

int uart_getc_nb(void)
{
    if ((USART2_SR & SR_RXNE) == 0u) {
        return -1;
    }
    return (int)(USART2_DR & 0xFFu);
}
