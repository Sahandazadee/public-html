#include <stdio.h>

static void on_tick(void)
{
    int ticks = 0;              // باگ: هر بار از صفر شروع می‌شود
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
