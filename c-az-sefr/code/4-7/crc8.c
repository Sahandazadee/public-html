#include <stdio.h>
#include <stdint.h>
#include <stddef.h>

/* CRC-8 بیت‌به‌بیت. چندجمله‌ای x^8+x^2+x+1 = 0x07، مقدار اولیه ۰ */
static uint8_t crc8_bitwise(const uint8_t *data, size_t len, uint8_t poly, uint8_t init)
{
    uint8_t crc = init;
    for (size_t i = 0; i < len; i++) {
        crc ^= data[i];
        for (int bit = 0; bit < 8; bit++) {
            if (crc & 0x80u) {
                crc = (uint8_t)((crc << 1) ^ poly);
            } else {
                crc = (uint8_t)(crc << 1);
            }
        }
    }
    return crc;
}

static uint8_t crc_table[256];

static void crc8_make_table(uint8_t poly)
{
    for (unsigned n = 0; n < 256u; n++) {
        uint8_t byte = (uint8_t)n;
        crc_table[n] = crc8_bitwise(&byte, 1, poly, 0);
    }
}

static uint8_t crc8_table(const uint8_t *data, size_t len)
{
    uint8_t crc = 0;
    for (size_t i = 0; i < len; i++) {
        crc = crc_table[crc ^ data[i]];
    }
    return crc;
}

int main(void)
{
    const uint8_t msg[] = { '1', '2', '3', '4', '5', '6', '7', '8', '9' };
    crc8_make_table(0x07);

    printf("crc8 bitwise = 0x%02X\n", (unsigned)crc8_bitwise(msg, sizeof msg, 0x07, 0x00));
    printf("crc8 table   = 0x%02X\n", (unsigned)crc8_table(msg, sizeof msg));
    printf("table[1..3]  = 0x%02X 0x%02X 0x%02X\n",
           (unsigned)crc_table[1], (unsigned)crc_table[2], (unsigned)crc_table[3]);

    const uint8_t w[] = { 0xBE, 0xEF };
    printf("poly 0x31 init 0xFF over BE EF = 0x%02X\n",
           (unsigned)crc8_bitwise(w, sizeof w, 0x31, 0xFF));
    return 0;
}
