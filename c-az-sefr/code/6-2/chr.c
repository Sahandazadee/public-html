#include <stdio.h>

int main(void)
{
    char c = (char)200;               // بایت 0xC8
    printf("(int)c = %d\n", (int)c);
    if (c > 100)
        printf("c > 100\n");
    else
        printf("c <= 100\n");
    return 0;
}
