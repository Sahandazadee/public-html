#include <stdint.h>

const uint8_t sine_table[16] = {
    128, 176, 218, 245, 255, 245, 218, 176,
    128,  79,  37,  10,   0,  10,  37,  79
};

uint8_t  rx_buf[64];
uint32_t adc_history[100];
