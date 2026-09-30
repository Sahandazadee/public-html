#include <stdio.h>
#include <stdint.h>

/* میانگین دو عدد. نسخهٔ ساده و خراب */
static uint32_t avg_bad(uint32_t a, uint32_t b)
{
    return (a + b) / 2u;
}

int main(void)
{
    uint32_t a = 3000000000u;
    uint32_t b = 3000000000u;
    printf("bad = %lu\n", (unsigned long)avg_bad(a, b));
    return 0;
}
