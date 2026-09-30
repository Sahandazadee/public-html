#include <stdio.h>
#include <stdint.h>

#define K 3                                  /* میانگین‌گیری روی ۲^۳ = ۸ نمونه */

typedef struct {
    uint16_t acc;                            /* ۱۲ بیت ADC + ۳ بیت اضافه = ۱۵ بیت */
} lpf_t;

static uint16_t lpf_update(lpf_t *f, uint16_t x)
{
    f->acc = (uint16_t)(f->acc + x - (f->acc >> K));
    return (uint16_t)(f->acc >> K);
}

int main(void)
{
    lpf_t f = { 0 };
    for (int i = 1; i <= 12; i++) {
        printf("step %2d: y = %u\n", i, (unsigned)lpf_update(&f, 1000u));
    }
    return 0;
}
