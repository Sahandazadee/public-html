#include <stdint.h>

typedef struct {
    uint8_t data[256];
} packet_t;

volatile uint8_t g_sink;

void clear_packet(packet_t *p)
{
    packet_t empty = { { 0 } };     /* ساختار ۲۵۶ بایتی صفرشده */
    *p = empty;                     /* کپی ساختار */
    g_sink = p->data[0];
}
