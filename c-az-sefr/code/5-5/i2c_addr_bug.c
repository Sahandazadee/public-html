#include <stdint.h>
#include <stdio.h>

/* شبیه‌سازی باس: فقط یک دستگاه با آدرس ۷ بیتی 0x76 روی آن هست */
static int i2c_probe(uint8_t addr7)
{
    return addr7 == 0x76u;
}

int main(void)
{
    uint8_t addr = 0xECu;               // «آدرس نوشتن» از روی یک برگهٔ داده

    if (i2c_probe(addr)) {
        printf("BME280 found\n");
    } else {
        printf("no ACK from 0x%02X\n", addr);
    }
    return 0;
}
