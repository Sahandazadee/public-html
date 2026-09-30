#include <stdio.h>

static int average(const int *v, int n)
{
    int sum = 0;                        // 1: مقدار اولیه
    for (int i = 0; i < n; i++)         // 2: < نه <=
        sum += v[i];
    return sum / n;
}

int main(void)
{
    int readings[4] = {20, 22, 21, 23};
    int count = (int)(sizeof(readings) / sizeof(readings[0]));   // 3: تعداد عنصر
    printf("%d\n", average(readings, count));
    return 0;
}
