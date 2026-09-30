#ifndef UART_H
#define UART_H

#include <stdint.h>

extern volatile uint8_t g_rx_flag;

void uart_init(void);
void uart_on_byte(uint8_t byte);
uint8_t uart_last_byte(void);

#endif /* UART_H */
