#include <stdint.h>

extern void uart_send(const uint8_t *data, uint32_t len);

void send_report(void)
{
    uint8_t report[256];
    for (uint32_t i = 0; i < 256; i++) {
        report[i] = (uint8_t)(i * 3u);
    }
    uart_send(report, 256);
}
