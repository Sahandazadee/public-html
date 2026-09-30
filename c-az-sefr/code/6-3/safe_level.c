#include <stdint.h>
#include <stdio.h>

static uint8_t level;

/* ۰ = موفق، -۱ = ورودی خارج از محدوده */
static int set_level(int raw)
{
    if ((raw < 0) || (raw > 127)) {
        return -1;                      // جلوی سرریز را همین‌جا می‌گیریم
    }
    level = (uint8_t)(raw * 2);         // حالا می‌دانیم جا می‌شود
    return 0;
}

static int clamp(int value)
{
    int limited = value;                // اسم تازه؛ level را سایه نمی‌زند
    if (limited > 100) {
        limited = 100;
    }
    return limited;
}

static int read_sensor(void)            // void = بدون پارامتر
{
    return 42;
}

int main(void)
{
    if (set_level(read_sensor()) != 0) {
        printf("out of range\n");
        return 1;
    }
    printf("%d %d\n", level, clamp(250));
    return 0;
}
