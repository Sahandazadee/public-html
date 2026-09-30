#include <stdio.h>
#include <stddef.h>

static size_t count_bad(int values[4])
{
    return sizeof(values) / sizeof(values[0]);   // اینجا values اشاره‌گر است، نه آرایه
}

int main(void)
{
    int data[4] = {1, 2, 3, 4};
    printf("in main : %zu elements\n", sizeof(data) / sizeof(data[0]));
    printf("in func : %zu elements\n", count_bad(data));
    return 0;
}
