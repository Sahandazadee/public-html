#include <stdint.h>

#define USART2_BASE  0x40004400UL
#define USART2_SR    (*(volatile uint32_t *)(USART2_BASE + 0x00UL))
#define USART2_DR    (*(volatile uint32_t *)(USART2_BASE + 0x04UL))
#define USART_SR_TXE (1UL << 7)

// newlib هر printf را در نهایت به _write می‌رساند
int _write(int fd, const char *buf, int len)
{
    (void)fd;
    for (int i = 0; i < len; i++) {
        while ((USART2_SR & USART_SR_TXE) == 0) {
            // منتظر بمان تا دیتاریجستر خالی شود
        }
        USART2_DR = (uint32_t)(unsigned char)buf[i];
    }
    return len;
}
