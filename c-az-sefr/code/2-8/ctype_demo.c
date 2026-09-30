#include <stdio.h>
#include <ctype.h>

int main(void)
{
    char text[] = "Room 42: led on";
    int letters = 0;
    int digits = 0;
    int spaces = 0;

    for (int i = 0; text[i] != '\0'; i++) {
        unsigned char c = (unsigned char)text[i];
        if (isalpha(c)) {
            letters++;
        } else if (isdigit(c)) {
            digits++;
        } else if (isspace(c)) {
            spaces++;
        }
        text[i] = (char)toupper(c);
    }
    printf("%s\n", text);
    printf("letters=%d digits=%d spaces=%d\n", letters, digits, spaces);
    return 0;
}
