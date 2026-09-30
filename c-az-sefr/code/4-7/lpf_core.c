#include <stdint.h>

#define K 3                                     // ۲^۳ = ۸ نمونه

typedef struct { uint16_t acc; } lpf_t;

uint16_t lpf_update(lpf_t *f, uint16_t x)
{
    f->acc = (uint16_t)(f->acc + x - (f->acc >> K));
    return (uint16_t)(f->acc >> K);
}
