#include <stdint.h>
#include <stdio.h>

static volatile uint32_t g_ticks = 4294967290u;   // ۵ms مانده به چرخش

static uint32_t millis(void) { return g_ticks; }

static void sim_wait_step(void) { g_ticks++; }

int main(void)
{
    uint32_t start = millis();
    uint32_t timeout_ms = 20u;

    while (millis() - start < timeout_ms) {    // تفریق بی‌علامت: امن در برابر چرخش
        sim_wait_step();
    }
    printf("waited %u ms\n", (unsigned)(millis() - start));
    return 0;
}
