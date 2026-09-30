#include <stdio.h>

int main(void)
{
    int celsius = 25;
    int fahrenheit = celsius * 9 / 5 + 32;

    printf("%d C = %d F\n", celsius, fahrenheit);
    return 0;
}
