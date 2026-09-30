#include <stdio.h>
#include <stdint.h>

/* نسخهٔ اول: ساده‌لوحانه */
static uint8_t sat_add_u8(uint8_t a, uint8_t b)
{
    return (uint8_t)(a + b);
}

int main(void)
{
    int failures = 0;
    if (sat_add_u8(10, 20) != 30) { printf("FAIL 1\n"); failures++; }
    if (sat_add_u8(200, 100) != 255) { printf("FAIL 2\n"); failures++; }
    printf("%d failures\n", failures);
    return failures;
}
