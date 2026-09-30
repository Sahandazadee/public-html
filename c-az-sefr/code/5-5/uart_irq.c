#include <stdint.h>

#define USART2_SR   (*(volatile uint32_t *)0x40004400u)
#define USART2_DR   (*(volatile uint32_t *)0x40004404u)
#define USART2_CR1  (*(volatile uint32_t *)0x4000440Cu)
#define NVIC_ISER1  (*(volatile uint32_t *)0xE000E104u)

#define SR_ORE      (1u << 3)
#define SR_RXNE     (1u << 5)
#define CR1_RXNEIE  (1u << 5)
#define USART2_IRQN 38u

#define RX_SIZE 64u

static volatile uint8_t  rx_buf[RX_SIZE];
static volatile uint32_t rx_head;
static volatile uint32_t rx_tail;

void USART2_IRQHandler(void)
{
    uint32_t sr = USART2_SR;

    if ((sr & (SR_RXNE | SR_ORE)) != 0u) {
        uint8_t byte = (uint8_t)USART2_DR;
        uint32_t next = (rx_head + 1u) & (RX_SIZE - 1u);

        if ((sr & SR_RXNE) != 0u && next != rx_tail) {
            rx_buf[rx_head] = byte;
            rx_head = next;
        }
    }
}

void uart_rx_irq_enable(void)
{
    USART2_CR1 |= CR1_RXNEIE;
    NVIC_ISER1 = 1u << (USART2_IRQN - 32u);
}

int uart_read_byte(void)
{
    if (rx_tail == rx_head) {
        return -1;
    }
    uint8_t byte = rx_buf[rx_tail];
    rx_tail = (rx_tail + 1u) & (RX_SIZE - 1u);
    return (int)byte;
}
