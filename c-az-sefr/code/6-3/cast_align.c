#include <stdint.h>

uint32_t first_word(uint8_t *p)
{
    return *(uint32_t *)p;      // p ممکن است آدرس فرد باشد!
}
