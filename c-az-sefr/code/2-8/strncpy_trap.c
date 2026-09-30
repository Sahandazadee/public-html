#include <stdio.h>
#include <string.h>

int main(void)
{
    char dst[4];
    memset(dst, '#', sizeof(dst));      // همه را '#' کن تا ببینیم چه می‌شود

    strncpy(dst, "abcd", sizeof(dst));  // دقیقا ۴ حرف؛ جایی برای '\0' نمانده
    for (size_t i = 0; i < sizeof(dst); i++) {
        printf("%02X ", (unsigned char)dst[i]);
    }
    printf("\n");

    // روش امن: یک خانه کمتر کپی کن و خودت پایان را بگذار
    strncpy(dst, "abcd", sizeof(dst) - 1);
    dst[sizeof(dst) - 1] = '\0';
    printf("safe copy: %s\n", dst);
    return 0;
}
