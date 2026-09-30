#include <stdint.h>
#include <stddef.h>

uint32_t sum(const uint16_t *a, size_t n)
{
    uint32_t s = 0;
    for (size_t i = 0; i < n; i++) {
        s += a[i];
    }
    return s;
}
