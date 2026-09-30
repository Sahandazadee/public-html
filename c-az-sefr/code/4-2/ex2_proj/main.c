#include <stdio.h>
#include "uart.h"

int main(void)
{
    uart_init();
    uart_on_byte(65);
    if (g_rx_flag) {
        printf("rx_flag=%u byte=%u\n", (unsigned)g_rx_flag, (unsigned)uart_last_byte());
    }
    return 0;
}
