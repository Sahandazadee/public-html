#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint16_t total = 0;
    int i;

    for (i = 0; i < 100; i++) {
        total = total + 10;
    }
    printf("total = %u\n", (unsigned)total);
    return 0;
}
