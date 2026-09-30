#include <stdio.h>

typedef void (*visit_fn)(int value);    // نوع: تابعی که int می‌گیرد و چیزی برنمی‌گرداند

static void print_value(int value)  { printf("[%d] ", value); }
static void print_double(int value) { printf("[%d] ", value * 2); }

static void for_each(const int *items, int count, visit_fn fn)
{
    for (int i = 0; i < count; i++) {
        fn(items[i]);               // callback: هر عضو را به fn بده
    }
}

int main(void)
{
    const int data[4] = {3, 8, 1, 6};

    for_each(data, 4, print_value);
    printf("\n");
    for_each(data, 4, print_double);
    printf("\n");
    return 0;
}
