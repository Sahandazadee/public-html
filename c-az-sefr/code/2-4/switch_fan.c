#include <stdio.h>

int main(void)
{
    int fan_mode = 2;

    switch (fan_mode) {
    case 0:
        printf("fan off\n");
        break;
    case 1:
        printf("fan low\n");
        break;
    case 2:
        printf("fan medium\n");
        break;
    case 3:
        printf("fan high\n");
        break;
    default:
        printf("unknown mode\n");
        break;
    }
    return 0;
}
