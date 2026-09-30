#include <stdint.h>

#define USART2_SR (*(volatile uint32_t *)0x40004400u)
#define USART2_DR (*(volatile uint32_t *)0x40004404u)

#define SR_TC  (1u << 6)
#define SR_TXE (1u << 7)

uint32_t millis(void);

int uart_putc_timeout(char c, uint32_t timeout_ms)
{
    uint32_t start = millis();

    while ((USART2_SR & SR_TXE) == 0u) {
        if ((uint32_t)(millis() - start) >= timeout_ms) {
            return -1;
        }
    }
    USART2_DR = (uint32_t)(uint8_t)c;
    return 0;
}

int uart_puts_safe(const char *s, uint32_t timeout_ms)
{
    while (*s != '\0') {
        if (uart_putc_timeout(*s, timeout_ms) != 0) {
            return -1;
        }
        s++;
    }

    uint32_t start = millis();
    while ((USART2_SR & SR_TC) == 0u) {
        if ((uint32_t)(millis() - start) >= timeout_ms) {
            return -1;
        }
    }
    return 0;
}
