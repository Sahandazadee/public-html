#include <stdint.h>
#include <stdio.h>

static void copy_bytes(void *dst, const void *src, size_t n)
{
    uint8_t *d = dst;
    const uint8_t *s = src;
    while (n > 0) {
        *d++ = *s++;
        n--;
    }
}

int main(void)
{
    int32_t from[3] = {7, 8, 9};
    int32_t to[3] = {0, 0, 0};
    copy_bytes(to, from, sizeof from);
    printf("%d %d %d\n", (int)to[0], (int)to[1], (int)to[2]);
    return 0;
}
