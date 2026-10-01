#include <stddef.h>

/* بدون این صفت، GCC خودِ حلقه‌ها را دوباره به memcpy/memset تبدیل می‌کند */
#define NO_IDIOM __attribute__((optimize("no-tree-loop-distribute-patterns")))

NO_IDIOM void *memcpy(void *dst, const void *src, size_t n)
{
    unsigned char *d = dst;
    const unsigned char *s = src;

    while (n--) {
        *d++ = *s++;
    }
    return dst;
}

NO_IDIOM void *memset(void *dst, int value, size_t n)
{
    unsigned char *d = dst;

    while (n--) {
        *d++ = (unsigned char)value;
    }
    return dst;
}
