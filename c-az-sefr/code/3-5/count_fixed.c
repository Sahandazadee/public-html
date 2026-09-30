#include <stdio.h>

static void on_tick(void)
{
    static int ticks = 0;       // static: بین صدا زدن‌ها می‌ماند
    ticks++;
    printf("ticks = %d\n", ticks);
}

int main(void)
{
    for (int i = 0; i < 3; i++) {
        on_tick();
    }
    return 0;
}
