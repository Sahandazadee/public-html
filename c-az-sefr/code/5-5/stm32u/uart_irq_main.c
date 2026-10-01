#include <stdint.h>

void uart_init(uint32_t baud);
void uart_putc(char c);
void uart_puts(const char *s);
void uart_rx_irq_enable(void);
int uart_read_byte(void);

int main(void)
{
    uart_init(115200u);
    uart_puts("irq echo ready\r\n");
    uart_rx_irq_enable();

    for (;;) {
        int c = uart_read_byte();
        if (c >= 0) {
            uart_putc((char)c);
        }
    }
}
