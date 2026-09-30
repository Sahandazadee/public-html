#include <stdio.h>
#include <stdlib.h>

/* روی MCU: اینجا LED خطا را روشن می‌کنند، فایل و خط را ذخیره می‌کنند و می‌ایستند */
static void assert_failed(const char *file, int line)
{
    printf("ASSERT FAILED at %s:%d\n", file, line);
    exit(3);
}

#define ASSERT(cond) \
    do { if (!(cond)) assert_failed(__FILE__, __LINE__); } while (0)

static void set_duty(int percent)
{
    ASSERT(percent >= 0 && percent <= 100);
    printf("duty = %d%%\n", percent);
}

int main(void)
{
    set_duty(40);
    set_duty(140);      // اشتباه در جای دیگر برنامه
    return 0;
}
