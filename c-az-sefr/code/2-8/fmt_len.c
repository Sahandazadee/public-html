#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>

int main(void)
{
    uint8_t  small = 200;
    uint32_t big = 4000000000U;
    long long huge = 9000000000LL;
    size_t bytes = sizeof(big);

    printf("uint8_t   : %u\n", small);
    printf("uint32_t  : %" PRIu32 "\n", big);
    printf("hex32     : 0x%08" PRIX32 "\n", (uint32_t)0xBEEF);
    printf("long long : %lld\n", huge);
    printf("size_t    : %zu\n", bytes);
    return 0;
}
