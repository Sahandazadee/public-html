#include <stdio.h>

static int count_items(int a[])
{
    return sizeof(a) / sizeof(a[0]);
}

int main(void)
{
    int data[4] = {10, 20, 30, 40};
    printf("count = %d\n", count_items(data));
    return 0;
}
