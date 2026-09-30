#include <stdint.h>

uint32_t g_ticks;
uint32_t g_boot_count = 3;
const char g_name[] = "LOGGER";
static uint16_t s_samples[100];
const uint16_t g_limits[4] = {10, 20, 30, 40};

uint32_t work(void)
{
    static uint32_t runs;
    uint32_t local_sum = 0;
    runs++;
    for (uint32_t i = 0; i < 4; i++) {
        local_sum += g_limits[i];
    }
    return local_sum + runs + s_samples[0] + g_ticks + g_boot_count + (uint32_t)g_name[0];
}
