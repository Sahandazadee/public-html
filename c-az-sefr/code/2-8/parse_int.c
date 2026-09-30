#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>
#include <stdbool.h>

// رشته را به int تبدیل می‌کند. true یعنی موفق؛ عدد در *out نوشته می‌شود.
bool parse_int(const char text[], int *out)
{
    char *end;
    long value;

    if (text[0] == '\0') {
        return false;               // رشتهٔ خالی
    }
    errno = 0;
    value = strtol(text, &end, 10);
    if (end == text) {
        return false;               // هیچ رقمی پیدا نشد
    }
    if (*end != '\0') {
        return false;               // بعد از عدد، آشغال مانده
    }
    if (errno == ERANGE || value > INT_MAX || value < INT_MIN) {
        return false;               // عدد از محدوده بیرون است
    }
    *out = (int)value;
    return true;
}

int main(void)
{
    const char tests[][24] = {
        "42", "-17", "+8", "12abc", "", "abc", "3.5",
        "2147483648", "99999999999999999999", " 5"
    };
    int count = (int)(sizeof(tests) / sizeof(tests[0]));

    for (int i = 0; i < count; i++) {
        int n = 0;
        if (parse_int(tests[i], &n)) {
            printf("\"%s\" -> OK, %d\n", tests[i], n);
        } else {
            printf("\"%s\" -> rejected\n", tests[i]);
        }
    }
    printf("atoi(\"abc\") = %d, atoi(\"0\") = %d\n", atoi("abc"), atoi("0"));
    return 0;
}
