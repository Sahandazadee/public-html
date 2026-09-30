#include <stdio.h>

static size_t my_strlen(const char *s)
{
    const char *p = s;
    while (*p != '\0') {
        p++;
    }
    return (size_t)(p - s);
}

int main(void)
{
    const char *name = "STM32";
    char buf[] = "ESP32";
    buf[0] = 'e';
    printf("%s has %zu chars\n", name, my_strlen(name));
    printf("%s has %zu chars\n", buf, my_strlen(buf));
    return 0;
}
