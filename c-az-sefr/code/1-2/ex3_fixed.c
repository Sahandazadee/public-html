#include <stdio.h>
#include <stdint.h>

int main(void)
{
    int a = 10;
    int b = '7' - '0';
    uint8_t x = 200;
    uint8_t y = 100;
    uint16_t c = (uint16_t)(x + y);

    printf("a = %d\n", a);
    printf("b = %d\n", b);
    printf("c = %d\n", c);
    return 0;
}
