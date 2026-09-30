#include <stdint.h>
#include <stdio.h>

static uint8_t level;

void set_level(int raw)
{
    level = raw * 2;            // int در uint8_t
}

int clamp(int value)
{
    int level = value;          // هم‌نام متغیر سراسری
    if (level > 100) {
        level = 100;
    }
    return level;
}

int read_sensor()               // بدون void
{
    return 42;
}

int main(void)
{
    set_level(read_sensor());
    printf("%d %d\n", level, clamp(250));
    return 0;
}
