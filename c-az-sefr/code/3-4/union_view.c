#include <stdint.h>
#include <stdio.h>

typedef union {
    uint32_t word;
    uint16_t half[2];
    uint8_t byte[4];
} view32_t;

int main(void)
{
    view32_t v;
    v.word = 0x12345678u;
    printf("sizeof = %zu\n", sizeof(view32_t));
    printf("half[0] = 0x%04X, half[1] = 0x%04X\n", (unsigned)v.half[0], (unsigned)v.half[1]);
    printf("byte[0] = 0x%02X, byte[3] = 0x%02X\n", (unsigned)v.byte[0], (unsigned)v.byte[3]);
    v.byte[0] = 0xFF;
    printf("word now = 0x%08X\n", (unsigned)v.word);
    return 0;
}
