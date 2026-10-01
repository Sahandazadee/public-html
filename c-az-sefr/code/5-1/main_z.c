#include <stdint.h>

typedef struct {
    uint8_t data[256];
} packet_t;

void clear_packet(packet_t *p);

int main(void)
{
    static packet_t pkt;
    for (;;) {
        clear_packet(&pkt);
    }
}
