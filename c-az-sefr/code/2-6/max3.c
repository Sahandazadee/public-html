#include <stdio.h>

int max_of_two(int a, int b)
{
    if (a > b) {
        return a;
    }
    return b;
}

int max_of_three(int a, int b, int c)
{
    return max_of_two(max_of_two(a, b), c);
}

int main(void)
{
    printf("max_of_three(3, 9, 5) = %d\n", max_of_three(3, 9, 5));
    printf("max_of_three(-4, -8, -1) = %d\n", max_of_three(-4, -8, -1));
    return 0;
}
