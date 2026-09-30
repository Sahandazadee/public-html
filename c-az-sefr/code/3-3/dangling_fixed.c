#include <stdio.h>

static void make_id(int *out)
{
    *out = 7;
}

int main(void)
{
    int id;
    make_id(&id);
    printf("%d\n", id);
    return 0;
}
