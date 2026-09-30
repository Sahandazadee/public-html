#include <stdio.h>

int main(void)
{
    char letter = 'A';      // تک‌کوتیشن = یک حرف
    char digit = '7';       // این حرف «۷» است، نه عدد هفت!

    printf("letter as char   : %c\n", letter);
    printf("letter as number : %d\n", letter);
    printf("digit as char    : %c\n", digit);
    printf("digit as number  : %d\n", digit);
    printf("digit value      : %d\n", digit - '0');
    printf("next letter      : %c\n", letter + 1);
    return 0;
}
