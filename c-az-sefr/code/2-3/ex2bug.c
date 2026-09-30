#include <stdio.h>

int main(void)
{
    int done = 30;
    int total = 120;
    int percent = done / total * 100;

    printf("progress = %d%%\n", percent);
    return 0;
}
