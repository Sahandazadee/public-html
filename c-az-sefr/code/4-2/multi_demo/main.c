#include <stdio.h>
#include "counter.h"

void bump(void);

int main(void)
{
    bump();
    printf("%d\n", counter);
    return 0;
}
