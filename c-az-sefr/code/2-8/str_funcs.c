#include <stdio.h>
#include <string.h>

int main(void)
{
    char a[] = "apple";
    char b[] = "banana";
    char line[16] = "LED";           // جا برای ۱۵ حرف + '\0'

    // مقایسه: فقط علامت نتیجه مهم است
    printf("apple before banana: %s\n", strcmp(a, b) < 0 ? "yes" : "no");
    printf("apple vs apple     : %d\n", strcmp(a, "apple"));
    printf("apple vs app (3)   : %d\n", strncmp(a, "app", 3));

    // چسباندن
    strcat(line, " ");
    strcat(line, "ON");
    printf("line = \"%s\" (len %zu)\n", line, strlen(line));

    // جستجو
    printf("has letter 'O'     : %s\n", strchr(line, 'O') != NULL ? "yes" : "no");
    printf("has \"OFF\"          : %s\n", strstr(line, "OFF") != NULL ? "yes" : "no");

    // بایت‌های خام (بدون توجه به '\0')
    unsigned char raw[6];
    memset(raw, 0xAA, sizeof(raw));   // همه ۶ بایت را 0xAA کن
    memcpy(raw, "AB", 2);             // دو بایت اول را کپی کن
    for (size_t i = 0; i < sizeof(raw); i++) {
        printf("%02X ", raw[i]);
    }
    printf("\n");
    return 0;
}
