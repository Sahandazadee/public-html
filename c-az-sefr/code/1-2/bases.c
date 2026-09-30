#include <stdio.h>

int main(void)
{
    unsigned int n = 200;
    printf("decimal: %u\n", n);
    printf("hex:     %x\n", n);
    printf("hex 0x:  0x%X\n", n);
    printf("octal:   %o\n", n);
    return 0;
}
