#include <stdio.h>

int main(void)
{
    int done = 30;
    int total = 120;
    int percent = done * 100 / total;

    printf("progress = %d%%\n", percent);
    return 0;
}
