#include <stdio.h>

static void show(int arr[4])
{
    printf("inside function: %zu\n", sizeof(arr));
}

int main(void)
{
    int a[4] = {1, 2, 3, 4};
    printf("in main: %zu\n", sizeof(a));
    show(a);
    return 0;
}
