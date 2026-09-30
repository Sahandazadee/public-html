#include <stdio.h>

static int next_id(void)
{
    static int last = 100;      // فقط یک بار ساخته می‌شود
    last = last + 1;
    return last;
}

static int next_local(void)
{
    int last = 100;             // هر بار از نو
    last = last + 1;
    return last;
}

int main(void)
{
    for (int i = 0; i < 3; i++) {
        int a = next_id();
        int b = next_local();
        printf("call %d: static=%d local=%d\n", i + 1, a, b);
    }
    return 0;
}
