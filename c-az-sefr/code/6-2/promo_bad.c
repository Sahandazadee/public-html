#include <stdio.h>
#include <stdint.h>

int main(void)
{
    volatile uint16_t x = 0xFFFF;
    volatile uint8_t hi = 0xAB;
    uint32_t sq = x * x;             // uint16_t به int تبدیل می‌شود: 65535*65535 در int جا نمی‌شود
    uint32_t word = hi << 24;        // 0xAB به int می‌رود؛ شیفت به بیت 31 علامت را خراب می‌کند
    printf("sq = %u, word = 0x%08X\n", (unsigned)sq, (unsigned)word);
    return 0;
}
