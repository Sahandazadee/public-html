#include <stdio.h>

// شمردن حرف‌ها تا رسیدن به '\0'
int count_chars(const char text[])
{
    int n = 0;
    while (text[n] != '\0') {
        n++;
    }
    return n;
}

int main(void)
{
    char word[] = "sensor";
    printf("%d\n", count_chars(word));
    printf("%d\n", count_chars(""));
    return 0;
}
