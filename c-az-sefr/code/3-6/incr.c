#include <stdint.h>

volatile uint32_t g_events;

void on_event(void)
{
    g_events++;
}
