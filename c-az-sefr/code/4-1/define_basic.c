#include <stdio.h>

#define MAX_TEMP   80          // ثابت عددی
#define LED_COUNT  4
#define GREETING   "hello"     // ثابت رشته‌ای

int main(void)
{
    int limit = MAX_TEMP;
    int leds[LED_COUNT] = {0};
    printf("%s: limit=%d, leds=%zu\n", GREETING, limit, sizeof(leds) / sizeof(leds[0]));
    return 0;
}
