#include <stdio.h>
#include <stdint.h>

#define N 5

static int32_t readings[N] = {210, 215, 9999, 212, 208};   // 9999 = پارازیت سنسور

static int32_t average(const int32_t *v, int n)
{
    int32_t sum = 0;
    for (int i = 0; i < n; i++)
        sum += v[i];
    return sum / n;
}

int main(void)
{
    int32_t avg = average(readings, N);
    printf("average = %d\n", (int)avg);
    return 0;
}
