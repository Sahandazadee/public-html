#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define N 8

static int table[N];

int fill(int count)
{
    for (int i = 0; i <= N; i++) {       // یک خانه بیشتر
        table[i] = i * count;
    }
    return table[0];
}

char *make_name(const char *src)
{
    char *buf = malloc(8);
    strcpy(buf, src);                   // بدون بررسی اندازه و NULL
    return buf;
}

int average(const int *v, int n)
{
    int sum;                            // مقدار اولیه ندارد
    for (int i = 0; i < n; i++) {
        sum += v[i];
    }
    return sum / n;
}

void cleanup(void)
{
    char *p = malloc(16);
    if (p == NULL) {
        return;
    }
    p[0] = 'x';                         // free فراموش شده
}

int main(void)
{
    int v[3] = { 1, 2, 3 };
    printf("%d\n", average(v, 3));
    printf("%d\n", fill(2));
    free(make_name("abc"));
    cleanup();
    return 0;
}
