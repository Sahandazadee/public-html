#include <stdint.h>
#include <stdio.h>

static volatile uint32_t g_ticks = 0;   // شمارندهٔ میلی‌ثانیه

void SysTick_Handler(void)              // سخت‌افزار هر ۱ms صدایش می‌زند
{
    g_ticks++;
}

static uint32_t millis(void)
{
    return g_ticks;
}

int main(void)
{
    uint32_t last_led = 0;
    uint32_t last_sensor = 0;
    int led_on = 0;

    for (int ms = 0; ms < 2000; ms++) {
        SysTick_Handler();              // شبیه‌سازی: یک میلی‌ثانیه گذشت
        uint32_t now = millis();

        if (now - last_led >= 500u) {
            last_led += 500u;
            led_on = !led_on;
            printf("t=%4u ms  LED %s\n", (unsigned)now, led_on ? "ON" : "OFF");
        }
        if (now - last_sensor >= 700u) {
            last_sensor += 700u;
            printf("t=%4u ms  read sensor\n", (unsigned)now);
        }
    }
    return 0;
}
