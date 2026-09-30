#include <stdint.h>

uint32_t g_counter = 5;                         /* .data: مقدار اولیه دارد */
uint32_t g_total;                               /* .bss: صفر */
const uint32_t g_table[4] = { 1, 2, 4, 8 };     /* .rodata: فقط در Flash */
volatile uint32_t g_ticks;                      /* .bss */

/* تعریف «قوی»: جای نسخهٔ weak استارت‌آپ می‌نشیند */
void SysTick_Handler(void)
{
    g_ticks++;
}

int main(void)
{
    for (;;) {
        g_total += g_table[g_counter & 3u];
        g_counter++;
    }
}
