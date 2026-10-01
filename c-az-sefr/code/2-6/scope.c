#include <stdio.h>

int counter = 0;

void count_up(void)
{
    int calls = 0;
    calls = calls + 1;
    counter = counter + 1;
    printf("calls = %d, counter = %d\n", calls, counter);
}

int main(void)
{
    count_up();
    count_up();
    count_up();
    return 0;
}
