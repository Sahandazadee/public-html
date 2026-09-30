#include <stdio.h>
#include <stdint.h>

int main(void)
{
    uint8_t level = 250;
    int i;

    for (i = 0; i < 8; i++) {
        level = level + 1;
        printf("%u ", (unsigned)level);
    }
    printf("\n");

    uint8_t zero = 0;
    zero = zero - 1;
    printf("0 - 1 = %u\n", (unsigned)zero);
    return 0;
}
