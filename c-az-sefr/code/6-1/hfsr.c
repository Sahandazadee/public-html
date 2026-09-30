#include <stdio.h>
#include <stdint.h>

struct bit_name {
    uint8_t bit;
    const char *name;
};

static const struct bit_name hfsr_bits[] = {
    {1, "VECTTBL"}, {30, "FORCED"}, {31, "DEBUGEVT"},
};

static const struct bit_name cfsr_bits[] = {
    {8, "IBUSERR"}, {9, "PRECISERR"}, {15, "BFARVALID"}, {25, "DIVBYZERO"},
};

static void decode(const char *reg, uint32_t v, const struct bit_name *t, unsigned n)
{
    printf("%s = 0x%08X:", reg, (unsigned)v);
    for (unsigned i = 0; i < n; i++) {
        if (v & (1u << t[i].bit))
            printf(" %s", t[i].name);
    }
    printf("\n");
}

int main(void)
{
    decode("HFSR", 0x40000000u, hfsr_bits, sizeof hfsr_bits / sizeof hfsr_bits[0]);
    decode("CFSR", 0x00008200u, cfsr_bits, sizeof cfsr_bits / sizeof cfsr_bits[0]);
    return 0;
}
