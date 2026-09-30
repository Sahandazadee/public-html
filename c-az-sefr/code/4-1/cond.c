#include <stdio.h>

#ifndef BOARD              // اگر از بیرون (-D) داده نشده بود
#define BOARD 1            // پیش‌فرض: Nucleo
#endif

#if BOARD == 1
#define LED_PIN    5
#define BOARD_NAME "nucleo-f411re"
#elif BOARD == 2
#define LED_PIN    2
#define BOARD_NAME "esp32-devkit"
#else
#error "Unknown BOARD"
#endif

#ifdef DEBUG
#define LOG(msg) printf("[debug] %s\n", msg)
#else
#define LOG(msg) ((void)0)     // در نسخهٔ نهایی هیچ نمی‌شود
#endif

int main(void)
{
    printf("board=%s led_pin=%d\n", BOARD_NAME, LED_PIN);
    LOG("starting");
    return 0;
}
