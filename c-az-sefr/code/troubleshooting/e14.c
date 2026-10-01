#include <stdio.h>

void tick(void);

int main(void)
{
    int r = tick();
    printf("%d\n", r);
    return 0;
}

void tick(void) { }
