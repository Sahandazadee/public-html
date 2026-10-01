#include <stdint.h>
#include <stdio.h>
#include <string.h>

#define SQUARE(x) x * x
#define TIMEOUT_MS 100

static uint8_t buf[16];

int scale(int a)
{
    return SQUARE(a + 1);
}

void copy_in(const uint8_t *src, size_t n)
{
    memcpy(buf, src, sizeof(buf));
    if (n > sizeof(buf))
        n = sizeof(buf);
    for (size_t i = 0; i < n; i++)
        buf[i] = src[i];
}

int main(void)
{
    uint8_t data[4] = { 1, 2, 3, 4 };
    int32_t big = 70000;
    uint16_t small = big;
    copy_in(data, sizeof(data));
    printf("%d %u\n", scale(2), small);
    fputs("done\n", stdout);
    return TIMEOUT_MS;
}
