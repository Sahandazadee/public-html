#include <stdint.h>
#include <stdio.h>

static uint8_t checksum(const uint8_t *data, size_t len)
{
    uint8_t sum = 0;
    for (size_t i = 0; i < len; i++) {
        sum = (uint8_t)(sum + data[i]);
    }
    return sum;
}

int main(void)
{
    const uint8_t packet[] = {0x01, 0x02, 0xFF, 0x10};
    uint8_t cs = checksum(packet, sizeof packet);
    printf("checksum = 0x%02X\n", cs);
    return 0;
}
