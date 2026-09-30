#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>

int main(void)
{
    uint8_t  small = 200;
    int16_t  temp = -1234;
    uint32_t ticks = 4000000000U;

    printf("sizes: %zu %zu %zu\n", sizeof(small), sizeof(temp), sizeof(ticks));
    printf("small = %u\n", (unsigned)small);
    printf("temp  = %d\n", (int)temp);
    printf("ticks = %" PRIu32 "\n", ticks);
    printf("max u8 = %u, max u32 = %" PRIu32 "\n", (unsigned)UINT8_MAX, (uint32_t)UINT32_MAX);
    return 0;
}
