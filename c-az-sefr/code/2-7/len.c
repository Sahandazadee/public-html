#include <stdio.h>

static int sum_of(const int a[], int n)
{
    int total = 0;
    for (int i = 0; i < n; i++) {
        total += a[i];
    }
    return total;
}

static void fill(int a[], int n, int value)
{
    for (int i = 0; i < n; i++) {
        a[i] = value;
    }
}

int main(void)
{
    int data[4] = {10, 20, 30, 40};
    int count = sizeof(data) / sizeof(data[0]);

    printf("bytes = %zu, count = %d\n", sizeof(data), count);
    printf("sum = %d\n", sum_of(data, count));
    fill(data, count, 7);
    printf("after fill: %d %d %d %d\n", data[0], data[1], data[2], data[3]);
    return 0;
}
