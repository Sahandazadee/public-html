#include <stdio.h>

int g_count;                    // سراسری بدون مقدار
static int s_flag;              // static بدون مقدار
int g_table[4];                 // آرایهٔ سراسری بدون مقدار

int main(void)
{
    static int calls;           // static محلی بدون مقدار
    printf("g_count=%d s_flag=%d calls=%d\n", g_count, s_flag, calls);
    printf("table: %d %d %d %d\n", g_table[0], g_table[1], g_table[2], g_table[3]);
    return 0;
}
