#include <stdio.h>

static int count_over(const int *v, size_t n, int limit)
{
    int count = 0;
    for (const int *p = v; p < v + n; p++) {
        if (*p > limit) {
            count++;
        }
    }
    return count;
}

int main(void)
{
    int temps[6] = {21, 35, 28, 40, 19, 33};
    size_t n = sizeof temps / sizeof temps[0];
    printf("over 30: %d\n", count_over(temps, n, 30));
    return 0;
}
