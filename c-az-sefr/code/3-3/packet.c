#include <stdint.h>
#include <stdio.h>

static void write_u32_le(uint8_t *p, uint32_t v)
{
    p[0] = (uint8_t)(v & 0xFFu);
    p[1] = (uint8_t)((v >> 8) & 0xFFu);
    p[2] = (uint8_t)((v >> 16) & 0xFFu);
    p[3] = (uint8_t)((v >> 24) & 0xFFu);
}

static uint32_t read_u32_le(const uint8_t *p)
{
    return (uint32_t)p[0]
         | ((uint32_t)p[1] << 8)
         | ((uint32_t)p[2] << 16)
         | ((uint32_t)p[3] << 24);
}

int main(void)
{
    uint8_t frame[6] = {0xAA, 0, 0, 0, 0, 0x55};
    write_u32_le(frame + 1, 0xDEADBEEFu);
    for (int i = 0; i < 6; i++) {
        printf("%02X ", frame[i]);
    }
    printf("\n");
    printf("back = 0x%08X\n", (unsigned)read_u32_le(frame + 1));
    return 0;
}
