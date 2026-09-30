#include <stdio.h>
#include "config.h"

int main(void)
{
    tick();
    tick();
    g_tick_count += 10;
    printf("ticks = %d\n", g_tick_count);
    return 0;
}
