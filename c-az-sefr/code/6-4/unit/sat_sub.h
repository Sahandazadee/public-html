#ifndef SAT_SUB_H
#define SAT_SUB_H

#include <stdint.h>

/* تفریق اشباع‌شده: اگر نتیجه منفی شود روی ۰ می‌ماند (دور نمی‌زند) */
uint8_t sat_sub_u8(uint8_t a, uint8_t b);

#endif /* SAT_SUB_H */
