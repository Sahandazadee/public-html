#include "config.h"

int g_tick_count = 0;         /* تعریف: اینجا قفسه ساخته می‌شود */

void tick(void)
{
    g_tick_count++;
}
