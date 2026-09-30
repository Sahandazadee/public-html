#include <stdio.h>

int add(int x, int y);
void say_hello(void);

int main(void)
{
    say_hello();
    printf("2 + 3 = %d\n", add(2, 3));
    return 0;
}

void say_hello(void)
{
    printf("hello from a function\n");
}

int add(int x, int y)
{
    return x + y;
}
