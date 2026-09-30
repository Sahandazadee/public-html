#include <stdio.h>
#include <stdint.h>

#define N      5
#define MAX_OK 1000

static int32_t readings[N] = {210, 215, 9999, 212, 208};

static int32_t average(const int32_t *v, int n)
{
    int32_t sum = 0;
    int used = 0;
    for (int i = 0; i < n; i++) {
        if (v[i] > MAX_OK)
            continue;               // پارازیت را رد کن
        sum += v[i];
        used++;
    }
    return used > 0 ? sum / used : 0;
}

int main(void)
{
    printf("average = %d\n", (int)average(readings, N));
    return 0;
}
