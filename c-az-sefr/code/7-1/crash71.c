#include <stdint.h>
#include <stdio.h>

#define GPIOA_BSRR (*(volatile uint32_t *)0x40020018u)   /* آدرس رجیستر STM32 */

/* «منطق» که مستقیم به رجیستر دست می‌زند */
static void alarm_led(int on)
{
    GPIOA_BSRR = on ? (1u << 5) : (1u << 21);
}

int main(void)
{
    printf("before\n");
    fflush(stdout);
    alarm_led(1);
    printf("after\n");
    return 0;
}
