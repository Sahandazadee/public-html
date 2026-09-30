#include <stdio.h>

int main(void)
{
    int adc_zone = 3;

    switch (adc_zone) {
    case 0:
    case 1:
        printf("low zone\n");
        break;
    case 2:
    case 3:
        printf("high zone\n");
        break;
    default:
        printf("invalid zone\n");
        break;
    }
    return 0;
}
