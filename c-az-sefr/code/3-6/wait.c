#include <stdint.h>

uint32_t g_ready_plain;             // بدون volatile
volatile uint32_t g_ready_vol;      // با volatile

void wait_plain(void)
{
    while (g_ready_plain == 0) {
    }
}

void wait_volatile(void)
{
    while (g_ready_vol == 0) {
    }
}
