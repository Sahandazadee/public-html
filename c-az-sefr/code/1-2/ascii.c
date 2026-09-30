#include <stdio.h>

int main(void)
{
    char big = 'A';
    char small = 'a';
    char digit = '7';

    printf("'%c' = %d = 0x%02X\n", big, big, (unsigned)big);
    printf("'%c' = %d = 0x%02X\n", small, small, (unsigned)small);
    printf("'%c' = %d = 0x%02X\n", digit, digit, (unsigned)digit);
    printf("digit - '0' = %d\n", digit - '0');
    printf("'A' + 1 -> %c\n", big + 1);
    return 0;
}
