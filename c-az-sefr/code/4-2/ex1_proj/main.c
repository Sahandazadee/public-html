#include <stdio.h>
#include "conv.h"

int main(void)
{
    printf("%d C = %d F\n", 25, celsius_to_f(25));
    printf("clamp(150) = %d\n", clamp_int(150, 0, 100));
    return 0;
}
