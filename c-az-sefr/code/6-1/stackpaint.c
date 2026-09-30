#include <stdio.h>
#include <stdint.h>

#define STACK_WORDS 64
#define PAINT       0xA5A5A5A5u
#define CANARY      0xDEADBEEFu

static uint32_t stack_area[STACK_WORDS];    // شبیه‌سازی یک پشته (رشد از بالا به پایین)

static void stack_init(void)
{
    for (int i = 0; i < STACK_WORDS; i++)
        stack_area[i] = PAINT;
    stack_area[0] = CANARY;                 // نگهبان در انتهای پشته
}

static void fake_calls(int depth)           // مصرف پشته را شبیه‌سازی می‌کند
{
    for (int k = 0; k < depth; k++)
        stack_area[STACK_WORDS - 1 - k] = 0x1000u + (uint32_t)k;
}

static int stack_free_words(void)
{
    int n = 1;                              // خانهٔ 0 نگهبان است
    while (n < STACK_WORDS && stack_area[n] == PAINT)
        n++;
    return n - 1;
}

int main(void)
{
    stack_init();
    fake_calls(20);
    int free_w = stack_free_words();
    printf("used = %d words, free = %d words\n", STACK_WORDS - 1 - free_w, free_w);
    printf("canary %s\n", stack_area[0] == CANARY ? "intact" : "SMASHED");
    fake_calls(64);
    printf("canary %s\n", stack_area[0] == CANARY ? "intact" : "SMASHED");
    return 0;
}
