#include <stdio.h>
#include <stdint.h>

int main(void)
{
    int big = 300;
    uint8_t small = (uint8_t)big;
    float price = 3.99f;
    int whole = (int)price;
    double half = 7 / 2;

    printf("300 in uint8_t = %u\n", (unsigned)small);
    printf("3.99 as int    = %d\n", whole);
    printf("double half    = %.1f\n", half);
    return 0;
}
