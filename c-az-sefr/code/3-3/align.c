#include <stdint.h>
#include <stdio.h>
#include <string.h>

static uint32_t read_u32(const uint8_t *p)
{
    uint32_t v;
    memcpy(&v, p, sizeof v);
    return v;
}

int main(void)
{
    uint8_t buf[8] = {0, 0x78, 0x56, 0x34, 0x12, 0, 0, 0};
    printf("value = 0x%08X\n", (unsigned)read_u32(buf + 1));
    printf("alignof(uint32_t) = %zu\n", _Alignof(uint32_t));
    return 0;
}
