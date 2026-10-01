#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// مالکیت: تابع می‌سازد، صدازننده آزاد می‌کند (نام _alloc این را یادآوری می‌کند)
static char *name_alloc(const char *base, int id)
{
    size_t n = strlen(base) + 1U + 11U;
    char *s = malloc(n);
    if (s == NULL) {
        return NULL;
    }
    snprintf(s, n, "%s%d", base, id);
    return s;
}

int main(void)
{
    char *s = name_alloc("sensor", 3);
    if (s == NULL) {
        return 1;
    }
    printf("%s\n", s);
    free(s);
    s = NULL;
    return 0;
}
