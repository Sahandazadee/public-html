#include <stdio.h>

int main(void)
{
    char *msg = "hello";        // رشتهٔ ثابت: در بخش فقط‌خواندنی (Flash)
    printf("before: %s\n", msg);
    msg[0] = 'H';               // نوشتن در حافظهٔ فقط‌خواندنی
    printf("after : %s\n", msg);
    return 0;
}
