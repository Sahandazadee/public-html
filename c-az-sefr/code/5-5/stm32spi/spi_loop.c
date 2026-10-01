#include <stdint.h>

void uart_init(uint32_t baud);
void uart_puts(const char *s);

void spi2_init(void);
void spi2_cs_low(void);
void spi2_cs_high(void);
uint8_t spi2_xfer(uint8_t out);

int main(void)
{
    uart_init(115200u);
    spi2_init();
    uart_puts("spi loopback: PB15 -> PB14\r\n");

    unsigned bad = 0u;
    for (unsigned i = 0u; i < 256u; i++) {
        spi2_cs_low();
        uint8_t back = spi2_xfer((uint8_t)i);
        spi2_cs_high();
        if (back != (uint8_t)i) {
            bad++;
        }
    }
    uart_puts(bad == 0u ? "PASS\r\n" : "FAIL\r\n");

    for (;;) {
    }
}
