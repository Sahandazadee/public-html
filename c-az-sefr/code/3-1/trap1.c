#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint8_t status = 0x08;
    if (status & 0x08 == 0x08) {
        printf("bit 3 is set\n");
    } else {
        printf("bit 3 is NOT set\n");
    }
    return 0;
}
