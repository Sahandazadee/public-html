#include <stdint.h>

volatile uint32_t g_button_events;

/* تعریف قوی: جای نسخهٔ weak را می‌گیرد (پاک کردن پرچم EXTI در درس ۵.۳) */
void EXTI15_10_IRQHandler(void)
{
    g_button_events++;
}

int main(void)
{
    for (;;) { }
}
