#ifndef SATMATH_H
#define SATMATH_H

#include <stdint.h>

/* جمع اشباع‌شده: اگر از ۲۵۵ بگذرد روی ۲۵۵ می‌ماند (دور نمی‌زند) */
uint8_t sat_add_u8(uint8_t a, uint8_t b);

#endif /* SATMATH_H */
