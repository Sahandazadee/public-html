#include <stdint.h>

extern void send(const uint8_t *data, uint32_t len);

void log_small(void)
{
    uint8_t line[16];
    for (uint32_t i = 0; i < 16; i++) line[i] = (uint8_t)i;
    send(line, 16);
}

void log_big(void)
{
    uint8_t line[1024];
    for (uint32_t i = 0; i < 1024; i++) line[i] = (uint8_t)i;
    send(line, 1024);
}
