#include <stdio.h>

int main(void)
{
    int fan_mode = 1;

    switch (fan_mode) {
    case 1:
        printf("fan low\n");
    case 2:
        printf("fan medium\n");
        break;
    default:
        break;
    }
    return 0;
}
