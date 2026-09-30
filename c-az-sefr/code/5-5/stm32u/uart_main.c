#include <stdint.h>

void uart_init(uint32_t baud);
void uart_putc(char c);
void uart_puts(const char *s);
int uart_getc_nb(void);

int main(void)
{
    uart_init(115200u);
    uart_puts("hello from USART2\r\n");

    for (;;) {
        int c = uart_getc_nb();
        if (c >= 0) {
            uart_putc((char)c);
        }
    }
}
