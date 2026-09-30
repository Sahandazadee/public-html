#include "uart.h"

volatile uint8_t g_rx_flag = 0;
static uint8_t last_byte = 0;

void uart_init(void)
{
    g_rx_flag = 0;
    last_byte = 0;
}

void uart_on_byte(uint8_t byte)
{
    last_byte = byte;
    g_rx_flag = 1;
}

uint8_t uart_last_byte(void)
{
    return last_byte;
}
