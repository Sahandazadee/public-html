#include <stdint.h>
#include <stdio.h>
#include <string.h>

int main(void)
{
    float f = 1.0f;
    uint32_t bits;
    memcpy(&bits, &f, sizeof bits);
    printf("1.0f = 0x%08X\n", (unsigned)bits);
    return 0;
}
