#include <stdio.h>

int triple_if_positive(int n)
{
    if (n > 0) {
        return n * 3;
    }
}

int main(void)
{
    printf("%d\n", triple_if_positive(4));
    return 0;
}
