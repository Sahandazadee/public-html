#include <stdio.h>

#define MAX_TEMP 80;            // اشتباه: ; جزو ماکرو می‌شود

int main(void)
{
    int t = 90;
    if (t > MAX_TEMP) {
        printf("too hot\n");
    }
    return 0;
}
