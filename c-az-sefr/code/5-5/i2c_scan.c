#include <stdint.h>
#include <stdio.h>

static int i2c_probe(uint8_t addr7)
{
    return addr7 == 0x76u;
}

int main(void)
{
    uint8_t write_byte = 0xECu;                 // آنچه روی سیم می‌رود: آدرس‌۷بیتی + بیت W
    uint8_t addr7 = (uint8_t)(write_byte >> 1); // آدرس واقعی

    printf("8-bit write byte 0x%02X = 7-bit address 0x%02X\n", write_byte, addr7);
    for (uint8_t a = 0x08u; a <= 0x77u; a++) {
        if (i2c_probe(a)) {
            printf("found device at 0x%02X\n", a);
        }
    }
    return 0;
}
