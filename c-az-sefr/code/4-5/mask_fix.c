#include <stdio.h>

#define SIZE 8U
#define MASK (SIZE - 1U)

_Static_assert((SIZE & MASK) == 0U, "SIZE must be a power of two");

int main(void)
{
    printf("mask:   ");
    for (unsigned head = 0; head < 16; head++) {
        printf("%u ", head & MASK);
    }
    printf("\n");
    return 0;
}
