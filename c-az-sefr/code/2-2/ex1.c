#include <stdio.h>
#include <stdint.h>

int main(void)
{
    printf("int8_t : %d .. %d\n", INT8_MIN, INT8_MAX);
    printf("uint8_t: 0 .. %d\n", UINT8_MAX);
    printf("int16_t: %d .. %d\n", INT16_MIN, INT16_MAX);
    printf("uint16_t: 0 .. %d\n", UINT16_MAX);
    return 0;
}
