#include <stdint.h>
#include <stdio.h>

struct status_bits {
    unsigned ready : 1;
    unsigned error : 1;
    unsigned mode  : 3;
};

#define ST_READY  (1u << 0)
#define ST_ERROR  (1u << 1)
#define ST_MODE_SHIFT 2u
#define ST_MODE_MASK  (0x7u << ST_MODE_SHIFT)

int main(void)
{
    struct status_bits s = {.ready = 1, .mode = 5};
    uint8_t reg = 0;

    reg |= ST_READY;
    reg |= (uint8_t)(5u << ST_MODE_SHIFT);

    printf("sizeof(bit-field struct) = %zu\n", sizeof s);
    printf("bit-field: ready=%u error=%u mode=%u\n", s.ready, s.error, s.mode);
    printf("mask:      ready=%u error=%u mode=%u\n",
           (unsigned)(reg & ST_READY),
           (unsigned)((reg & ST_ERROR) != 0u),
           (unsigned)((reg & ST_MODE_MASK) >> ST_MODE_SHIFT));
    return 0;
}
