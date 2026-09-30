#include <stdio.h>

#define SIZE 6U
#define MASK (SIZE - 1U)        // 5 = 0b101

int main(void)
{
    printf("mask:   ");
    for (unsigned head = 0; head < 12; head++) {
        printf("%u ", head & MASK);
    }
    printf("\nmodulo: ");
    for (unsigned head = 0; head < 12; head++) {
        printf("%u ", head % SIZE);
    }
    printf("\n");
    return 0;
}
