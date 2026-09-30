#include <stdio.h>

int read_first(int *p)
{
    int value = *p;         // اول از p می‌خوانیم...
    if (p == NULL)          // ...بعد وارسی می‌کنیم؟!
        return -1;
    return value;
}

int main(void)
{
    int x = 42;
    printf("%d\n", read_first(&x));
    return 0;
}
