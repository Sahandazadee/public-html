#include <stdio.h>

int main(void)
{
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int (*row)[3] = m;
    const char *names[] = {"red", "green", "blue"};

    printf("%d %d\n", row[1][2], *(*(m + 1) + 2));
    printf("%zu %zu\n", sizeof m[0], sizeof m);
    printf("%s %c\n", names[1], names[2][0]);
    return 0;
}
