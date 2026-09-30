#include <stdio.h>
#include <stdint.h>
#include <string.h>

int main(void)
{
    uint8_t packet[8] = {0x01, 0x78, 0x56, 0x34, 0x12, 0, 0, 0};

    uint32_t *p = (uint32_t *)&packet[1];     // آدرس فرد: ناهم‌تراز برای 32 بیتی
    printf("cast   : 0x%08X\n", (unsigned)*p);

    uint32_t v;
    memcpy(&v, &packet[1], sizeof v);         // روش امن
    printf("memcpy : 0x%08X\n", (unsigned)v);
    return 0;
}
