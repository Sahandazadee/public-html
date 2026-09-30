#include <stdio.h>
#include <stdint.h>

/* میانگین بدون سرریز، بدون نیاز به نوع پهن‌تر */
static uint32_t avg_u32(uint32_t a, uint32_t b)
{
    return (a & b) + ((a ^ b) >> 1);      /* بیت‌های مشترک + نصفِ تفاوت */
}

static uint32_t avg_wide(uint32_t a, uint32_t b)
{
    return (uint32_t)(((uint64_t)a + b) / 2u);
}

int main(void)
{
    uint32_t a = 3000000000u;
    uint32_t b = 3000000000u;
    printf("bit trick = %lu\n", (unsigned long)avg_u32(a, b));
    printf("uint64    = %lu\n", (unsigned long)avg_wide(a, b));
    printf("7 and 10  = %lu\n", (unsigned long)avg_u32(7u, 10u));
    return 0;
}
