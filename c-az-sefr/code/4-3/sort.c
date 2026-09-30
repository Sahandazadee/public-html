#include <stdio.h>
#include <stdlib.h>

typedef struct {
    const char *name;
    int mv;
} reading_t;

static int cmp_int(const void *a, const void *b)
{
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

static int cmp_reading_desc(const void *a, const void *b)
{
    const reading_t *x = a;
    const reading_t *y = b;
    return (y->mv > x->mv) - (y->mv < x->mv);
}

int main(void)
{
    int v[6] = {42, 7, 19, 3, 25, 11};
    reading_t r[4] = {{"ch0", 3120}, {"ch1", 2980}, {"ch2", 3300}, {"ch3", 3050}};

    qsort(v, 6, sizeof v[0], cmp_int);
    for (int i = 0; i < 6; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");

    qsort(r, 4, sizeof r[0], cmp_reading_desc);
    for (int i = 0; i < 4; i++) {
        printf("%s=%d ", r[i].name, r[i].mv);
    }
    printf("\n");
    return 0;
}
