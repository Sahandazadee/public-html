#include <stdio.h>
#include <stdint.h>

// چاپ یک بایت به‌صورت هشت رقم صفر و یک
static void print_bin8(uint8_t v)
{
    for (int i = 7; i >= 0; i--) {
        putchar(((v >> i) & 1U) ? '1' : '0');
    }
}

int main(void)
{
    uint8_t a = 0xCA;   // 11001010
    uint8_t b = 0xAC;   // 10101100

    printf("a     = "); print_bin8(a); printf("\n");
    printf("b     = "); print_bin8(b); printf("\n");
    printf("a & b = "); print_bin8(a & b); printf("\n");
    printf("a | b = "); print_bin8(a | b); printf("\n");
    printf("a ^ b = "); print_bin8(a ^ b); printf("\n");
    printf("~a    = "); print_bin8((uint8_t)~a); printf("\n");
    return 0;
}
