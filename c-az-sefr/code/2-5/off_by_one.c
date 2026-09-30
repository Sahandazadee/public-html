#include <stdio.h>

int main(void)
{
    int count_a = 0;
    int count_b = 0;

    for (int i = 0; i < 5; i++) {
        count_a++;
    }
    for (int i = 0; i <= 5; i++) {
        count_b++;
    }
    printf("i < 5 runs %d times\n", count_a);
    printf("i <= 5 runs %d times\n", count_b);
    return 0;
}
