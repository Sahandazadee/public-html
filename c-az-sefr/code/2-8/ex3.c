#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

// "T=23.5C\r\n" را در out می‌سازد؛ اگر جا کم بود false برمی‌گرداند
static bool format_reading(char out[], size_t size, int t10)
{
    int a = abs(t10);
    const int need = snprintf(out, size, "T=%s%d.%dC\r\n",
                              (t10 < 0) ? "-" : "", a / 10, a % 10);
    return need >= 0 && (size_t)need < size;
}

int main(void)
{
    char big[16];
    char small[10];

    if (format_reading(big, sizeof(big), -235)) {
        printf("big   : ok\n");
    }
    printf("small : %s\n", format_reading(small, sizeof(small), -235) ? "ok" : "TRUNCATED");
    printf("small : %s\n", format_reading(small, sizeof(small), 7) ? "ok" : "TRUNCATED");
    return 0;
}
