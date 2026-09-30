#include <stdint.h>
#include <stdio.h>

int main(void)
{
    uint32_t value = 0x12345678;
    const uint8_t *b = (const uint8_t *)&value;

    for (int i = 0; i < 4; i++) {
        printf("byte %d = 0x%02X\n", i, b[i]);
    }
    return 0;
}
