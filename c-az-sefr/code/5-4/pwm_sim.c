#include <stdint.h>
#include <stdio.h>

int main(void)
{
    uint32_t arr = 9u;                  // شمارنده از ۰ تا ۹ (ده حالت)
    uint32_t ccr1 = 3u;                 // مقایسه با ۳
    uint32_t cnt = 0u;

    printf("CNT:");
    for (int i = 0; i < 30; i++) {
        printf(" %u", (unsigned)cnt);
        cnt = (cnt == arr) ? 0u : cnt + 1u;
    }
    printf("\nOUT: ");
    cnt = 0u;
    for (int i = 0; i < 30; i++) {
        putchar(cnt < ccr1 ? '#' : '_');    // PWM حالت ۱: بالا تا وقتی CNT < CCR1
        putchar(' ');
        cnt = (cnt == arr) ? 0u : cnt + 1u;
    }
    printf("\nduty = %u/%u = %u%%\n", (unsigned)ccr1, (unsigned)(arr + 1u),
           (unsigned)(100u * ccr1 / (arr + 1u)));
    return 0;
}
