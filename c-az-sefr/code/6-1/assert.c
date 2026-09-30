#include <assert.h>
#include <stdio.h>

#define N 4
static int table[N] = {1, 2, 3, 4};

static int get(int idx)
{
    assert(idx >= 0 && idx < N);    // قرارداد: ایندکس باید معتبر باشد
    return table[idx];
}

int main(void)
{
    printf("get(2) = %d\n", get(2));
    fflush(stdout);
    printf("get(7) = %d\n", get(7));
    return 0;
}
