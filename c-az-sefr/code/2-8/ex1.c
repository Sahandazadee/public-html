#include <stdio.h>
#include <string.h>
#include <ctype.h>

// شمردن حروف صدادار
static int count_vowels(const char text[])
{
    int n = 0;
    for (int i = 0; text[i] != '\0'; i++) {
        char c = (char)tolower((unsigned char)text[i]);
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            n++;
        }
    }
    return n;
}

// وارونه کردن در جا: اولی با آخری، دومی با ماقبل آخر، ...
static void reverse(char text[])
{
    size_t len = strlen(text);
    for (size_t i = 0; i < len / 2; i++) {
        char tmp = text[i];
        text[i] = text[len - 1 - i];
        text[len - 1 - i] = tmp;
    }
}

int main(void)
{
    char s[10] = "cat";
    printf("sizeof=%zu strlen=%zu s[3]=%d s[9]=%d\n", sizeof(s), strlen(s), s[3], s[9]);

    char word[] = "microcontroller";
    printf("%s has %d vowels\n", word, count_vowels(word));
    reverse(word);
    printf("reversed: %s\n", word);
    return 0;
}
