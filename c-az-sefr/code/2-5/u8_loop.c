#include <stdint.h>
#include <stdio.h>

int main(void)
{
    int count = 0;

    for (uint8_t i = 0; i <= 255; i++) {
        count++;
    }
    printf("%d\n", count);
    return 0;
}
