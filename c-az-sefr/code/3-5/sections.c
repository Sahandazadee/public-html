#include <stdint.h>

int g_counter = 5;              // سراسری با مقدار اولیه
int g_total;                    // سراسری بدون مقدار
const int g_limit = 100;        // سراسری const
static uint8_t s_buf[64];       // سراسری خصوصی فایل، بدون مقدار

int bump(void)
{
    static int calls = 0;       // static محلی
    int step = 2;               // محلی معمولی
    calls = calls + 1;
    g_total = g_total + step;
    s_buf[0] = (uint8_t)calls;
    return g_counter + g_limit + calls;
}
