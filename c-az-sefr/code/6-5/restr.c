#include <stdint.h>

void twice(uint32_t *a, const uint32_t *b)
{
    *a += *b;
    *a += *b;
}

void twice_r(uint32_t *restrict a, const uint32_t *restrict b)
{
    *a += *b;
    *a += *b;
}
