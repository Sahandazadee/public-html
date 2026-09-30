#include <stdio.h>

int main(void)
{
    const char *msg = "hello";   // متن ثابت در Flash
    msg[0] = 'H';                // تلاش برای تغییر متن ثابت
    printf("%s\n", msg);
    return 0;
}
