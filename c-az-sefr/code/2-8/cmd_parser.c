#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>
#include <errno.h>
#include <stdbool.h>

#define LINE_MAX_LEN 32

static bool led_on = false;
static int  blink_ms = 500;

// حذف فاصله و \r \n از انتهای خط، و بزرگ کردن حرف‌ها
static void normalize(char line[])
{
    size_t n = strlen(line);
    while (n > 0 && isspace((unsigned char)line[n - 1])) {
        line[n - 1] = '\0';
        n--;
    }
    for (size_t i = 0; i < n; i++) {
        line[i] = (char)toupper((unsigned char)line[i]);
    }
}

static bool parse_ms(const char text[], int *out)
{
    char *end;
    errno = 0;
    long v = strtol(text, &end, 10);
    if (end == text || *end != '\0' || errno == ERANGE || v < 10 || v > 5000) {
        return false;
    }
    *out = (int)v;
    return true;
}

static void handle_line(const char raw[])
{
    char line[LINE_MAX_LEN];

    if (strlen(raw) >= sizeof(line)) {
        printf("ERR too long\n");
        return;
    }
    strcpy(line, raw);
    normalize(line);

    if (strcmp(line, "LED ON") == 0) {
        led_on = true;
        printf("OK led=on\n");
    } else if (strcmp(line, "LED OFF") == 0) {
        led_on = false;
        printf("OK led=off\n");
    } else if (strncmp(line, "BLINK ", 6) == 0) {
        int ms;
        if (parse_ms(&line[6], &ms)) {
            blink_ms = ms;
            printf("OK blink=%d ms\n", blink_ms);
        } else {
            printf("ERR bad number\n");
        }
    } else {
        printf("ERR unknown command\n");
    }
}

int main(void)
{
    const char input[][64] = {
        "led on\r\n", "LED OFF", "blink 250", "BLINK abc", "BLINK 99999",
        "dance", "this line is far too long to fit in the buffer"
    };
    int count = (int)(sizeof(input) / sizeof(input[0]));

    for (int i = 0; i < count; i++) {
        handle_line(input[i]);
    }
    printf("final: led=%d blink=%d\n", led_on, blink_ms);
    return 0;
}
