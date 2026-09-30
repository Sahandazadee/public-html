#include <stdint.h>
#include <stdio.h>

static const char digits[] = "0123456789abcdef";

static char *hex_bad(uint8_t v)
{
    static char buf[3];
    buf[0] = digits[v >> 4];
    buf[1] = digits[v & 0xFu];
    buf[2] = '\0';
    return buf;
}

static void hex_ok(uint8_t v, char out[3])
{
    out[0] = digits[v >> 4];
    out[1] = digits[v & 0xFu];
    out[2] = '\0';
}

int main(void)
{
    char *a = hex_bad(0x0A);
    char *b = hex_bad(0xFF);
    printf("%s %s\n", a, b);

    char x[3];
    char y[3];
    hex_ok(0x0A, x);
    hex_ok(0xFF, y);
    printf("%s %s\n", x, y);
    return 0;
}
