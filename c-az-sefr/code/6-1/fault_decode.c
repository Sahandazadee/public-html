#include <stdio.h>
#include <stdint.h>

struct bit_name {
    uint8_t bit;
    const char *name;
};

static const struct bit_name cfsr_bits[] = {
    { 0, "IACCVIOL"},  { 1, "DACCVIOL"},  { 7, "MMARVALID"},
    { 8, "IBUSERR"},   { 9, "PRECISERR"}, {10, "IMPRECISERR"}, {15, "BFARVALID"},
    {16, "UNDEFINSTR"},{17, "INVSTATE"},  {18, "INVPC"},  {19, "NOCP"},
    {24, "UNALIGNED"}, {25, "DIVBYZERO"},
};

static void decode_cfsr(uint32_t cfsr)
{
    printf("CFSR = 0x%08X:", (unsigned)cfsr);
    for (unsigned i = 0; i < sizeof cfsr_bits / sizeof cfsr_bits[0]; i++) {
        if (cfsr & (1u << cfsr_bits[i].bit))
            printf(" %s", cfsr_bits[i].name);
    }
    printf("\n");
}

int main(void)
{
    decode_cfsr(0x00008200u);   // خواندن از آدرس نامعتبر
    decode_cfsr(0x02000000u);   // تقسیم بر صفر
    decode_cfsr(0x00020000u);   // پرش به آدرسی با بیت0 = 0
    return 0;
}
