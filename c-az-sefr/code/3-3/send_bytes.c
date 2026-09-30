#include <stddef.h>
#include <stdint.h>

#define USART2_BASE 0x40004400u
#define USART2_SR   ((volatile uint32_t *)(USART2_BASE + 0x00u))
#define USART2_DR   ((volatile uint32_t *)(USART2_BASE + 0x04u))
#define TXE_BIT     (1u << 7)

static void uart_send(const uint8_t *data, size_t len)
{
    for (size_t i = 0; i < len; i++) {
        while ((*USART2_SR & TXE_BIT) == 0u) {
            // منتظر خالی شدن ثبات ارسال
        }
        *USART2_DR = data[i];
    }
}

void app_send_hello(void)
{
    static const uint8_t msg[] = {'H', 'i', '\r', '\n'};
    uart_send(msg, sizeof msg);
}
