#include <stdio.h>
#include <stdint.h>

static uint32_t read_be32(const uint8_t *p)
{
    return ((uint32_t)p[0] << 24) | ((uint32_t)p[1] << 16)
         | ((uint32_t)p[2] << 8)  |  (uint32_t)p[3];
}

int main(void)
{
    const uint8_t frame[6] = {0xFF, 0x80, 0x00, 0x01, 0x02, 0xFF};
    printf("value = 0x%08X\n", (unsigned)read_be32(&frame[1]));
    return 0;
}
