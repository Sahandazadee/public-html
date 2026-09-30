#include <stdio.h>

int main(void)
{
    char c = 'A';
    printf("%c is %d\n", c, c);
    c = c + 1;
    printf("%c is %d\n", c, c);
    printf("digit 7 as text: %d\n", '7' - '0');
    return 0;
}
