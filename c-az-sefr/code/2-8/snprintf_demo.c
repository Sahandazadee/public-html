#include <stdio.h>

// می‌سازد: "name=value" و طول لازم را برمی‌گرداند
static int make_text(char out[], size_t size, const char name[], int value)
{
    return snprintf(out, size, "%s=%d", name, value);
}

int main(void)
{
    char buf[12];

    int need = make_text(buf, sizeof(buf), "temp", 235);
    printf("text = \"%s\", needed = %d, buffer = %zu\n", buf, need, sizeof(buf));

    need = make_text(buf, sizeof(buf), "temperature", 123456);
    printf("text = \"%s\", needed = %d, buffer = %zu\n", buf, need, sizeof(buf));

    if (need >= (int)sizeof(buf)) {
        int lost = need - ((int)sizeof(buf) - 1);
        printf("cut off! %d characters were lost\n", lost);
    }
    return 0;
}
