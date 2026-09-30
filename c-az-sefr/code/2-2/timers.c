#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>

int main(void)
{
    uint16_t ms16 = 65530;
    uint32_t ms32 = UINT32_MAX;

    ms16 = ms16 + 10;
    printf("16-bit ms counter after +10: %u\n", (unsigned)ms16);
    printf("32-bit counter lasts %" PRIu32 " days\n", ms32 / 1000U / 60U / 60U / 24U);
    printf("16-bit counter lasts %u seconds\n", (unsigned)(UINT16_MAX / 1000U));
    return 0;
}
