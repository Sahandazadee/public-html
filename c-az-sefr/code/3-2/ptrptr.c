#include <stdio.h>

// chosen آدرسِ یک اشاره‌گر است؛ با آن خودِ اشاره‌گرِ بیرون را عوض می‌کنیم
static void pick_larger(int *a, int *b, int **chosen)
{
    *chosen = (*a >= *b) ? a : b;
}

int main(void)
{
    int x = 7;
    int y = 12;
    int *best = NULL;
    int **pp = &best;

    pick_larger(&x, &y, &best);
    printf("*best = %d\n", *best);
    printf("**pp = %d\n", **pp);
    printf("pp == &best : %d\n", pp == &best);
    return 0;
}
