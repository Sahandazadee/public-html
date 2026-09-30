#include <stdio.h>

int main(void)
{
    double x = 0.1 + 0.2;
    float big = 16777216.0f;

    printf("0.1 + 0.2 = %.17f\n", x);
    printf("equal to 0.3? %s\n", (x == 0.3) ? "yes" : "no");
    printf("big + 1 = %.1f\n", (double)(big + 1.0f));
    printf("7 / 2 = %d, 7 / 2.0 = %.1f\n", 7 / 2, 7 / 2.0);
    return 0;
}
