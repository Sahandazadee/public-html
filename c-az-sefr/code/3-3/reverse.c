#include <stdio.h>

static void reverse(int *v, size_t n)
{
    if (n < 2) {
        return;                    // چیزی برای برعکس کردن نیست
    }
    int *lo = v;                   // اشاره‌گر به اولین عنصر
    int *hi = v + n - 1;           // اشاره‌گر به آخرین عنصر
    while (lo < hi) {
        int tmp = *lo;
        *lo = *hi;
        *hi = tmp;
        lo++;
        hi--;
    }
}

int main(void)
{
    int data[5] = {1, 2, 3, 4, 5};
    reverse(data, 5);
    for (int i = 0; i < 5; i++) {
        printf("data[%d] = %d\n", i, data[i]);
    }
    return 0;
}
