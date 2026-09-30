#include <stdio.h>

static int *make_id(void)
{
    int id = 7;
    return &id;
}

int main(void)
{
    int *p = make_id();
    printf("%d\n", *p);
    return 0;
}
