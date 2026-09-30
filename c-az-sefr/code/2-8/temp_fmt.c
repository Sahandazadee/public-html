#include <stdio.h>
#include <stdlib.h>

// دما به دهم درجه: 235 یعنی 23.5
static int format_temp(char out[], size_t size, int t10)
{
    int a = abs(t10);
    if (t10 < 0) {
        return snprintf(out, size, "-%d.%d", a / 10, a % 10);
    }
    return snprintf(out, size, "%d.%d", a / 10, a % 10);
}

int main(void)
{
    const int samples[] = { 235, 50, 5, 0, -5, -235, -1000 };
    char buf[12];

    for (size_t i = 0; i < sizeof(samples) / sizeof(samples[0]); i++) {
        format_temp(buf, sizeof(buf), samples[i]);
        printf("%5d -> %s C\n", samples[i], buf);
    }
    int t10 = -5;
    printf("naive: %d.%d\n", t10 / 10, abs(t10 % 10));
    return 0;
}
