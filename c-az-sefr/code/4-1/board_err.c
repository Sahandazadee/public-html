#include <stdio.h>

#define BOARD 3

#if BOARD == 1
#define LED_PIN 5
#elif BOARD == 2
#define LED_PIN 2
#else
#error "Unknown BOARD"
#endif

int main(void)
{
    printf("led_pin=%d\n", LED_PIN);
    return 0;
}
