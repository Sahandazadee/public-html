#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

/* جمع امن: قبل از جمع بررسی می‌کند که جا می‌شود یا نه */
static bool add_i32_checked(int32_t a, int32_t b, int32_t *out)
{
    if ((b > 0 && a > INT32_MAX - b) ||
        (b < 0 && a < INT32_MIN - b)) {
        return false;                       /* سرریز می‌شد */
    }
    *out = a + b;
    return true;
}

/* جمع اشباعی بی‌علامت ۸ بیتی: از ۲۵۵ رد نمی‌شود */
static uint8_t add_sat_u8(uint8_t a, uint8_t b)
{
    unsigned sum = (unsigned)a + b;         /* در نوع پهن‌تر جمع می‌کنیم */
    return (sum > 255u) ? 255u : (uint8_t)sum;
}

/* جمع اشباعی علامت‌دار ۱۶ بیتی */
static int16_t add_sat_i16(int16_t a, int16_t b)
{
    int32_t sum = (int32_t)a + b;
    if (sum > INT16_MAX) return INT16_MAX;
    if (sum < INT16_MIN) return INT16_MIN;
    return (int16_t)sum;
}

int main(void)
{
    int32_t r = 0;

    printf("wrap u8 : %u\n", (unsigned)(uint8_t)(250 + 10));
    printf("sat  u8 : %u\n", (unsigned)add_sat_u8(250, 10));
    printf("sat  i16: %d\n", add_sat_i16(30000, 5000));
    printf("sat  i16: %d\n", add_sat_i16(-30000, -5000));

    if (add_i32_checked(2000000000, 2000000000, &r)) {
        printf("sum = %ld\n", (long)r);
    } else {
        printf("overflow detected\n");
    }
    if (add_i32_checked(1000, 2000, &r)) {
        printf("sum = %ld\n", (long)r);
    }
    return 0;
}
