#include <stdint.h>
#include <stdio.h>

static volatile uint32_t g_ticks = 0;
static uint32_t ready_at = 0;           // شبیه‌سازی: سنسور کی آماده می‌شود

static uint32_t millis(void) { return g_ticks; }

static int sensor_ready(void)
{
    g_ticks++;                          // شبیه‌سازی: هر بار پرسیدن ۱ms طول می‌کشد
    return g_ticks >= ready_at;
}

/* ۱ = آماده شد، ۰ = مهلت تمام شد */
static int wait_ready(uint32_t timeout_ms)
{
    uint32_t start = millis();
    while (!sensor_ready()) {
        if (millis() - start >= timeout_ms) {
            return 0;
        }
    }
    return 1;
}

int main(void)
{
    ready_at = 12;
    printf("fast sensor: %s\n", wait_ready(20) ? "ready" : "timeout");
    g_ticks = 0;
    ready_at = 500;
    int ok = wait_ready(20);
    printf("dead sensor: %s at t=%u ms\n", ok ? "ready" : "timeout", (unsigned)millis());
    return 0;
}
