#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint8_t total = 0;
    int i;

    for (i = 0; i < 100; i++) {
        total = total + 10;
    }
    printf("total = %u (expected 1000)\n", (unsigned)total);
    return 0;
}
