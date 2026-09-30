#include <stdio.h>

static volatile int pending_flag;         /* نسخهٔ ۱: فقط یک پرچم */
static volatile unsigned pending_count;   /* نسخهٔ ۲: شمارنده */

static void fake_isr(void)
{
    pending_flag = 1;
    pending_count++;
}

int main(void)
{
    /* در هر «دور main» چند وقفه پیش از رسیدگی می‌رسد */
    const int irqs_per_round[] = {0, 1, 3, 0, 2, 0};
    const int rounds = (int)(sizeof irqs_per_round / sizeof irqs_per_round[0]);
    int total = 0, by_flag = 0;
    unsigned by_count = 0;

    for (int r = 0; r < rounds; r++) {
        for (int k = 0; k < irqs_per_round[r]; k++) {
            fake_isr();
            total++;
        }
        if (pending_flag) {               /* main فقط می‌فهمد «اتفاقی افتاد» */
            pending_flag = 0;
            by_flag++;
        }
        while (by_count < pending_count) {/* main همهٔ رویدادها را می‌شمارد */
            by_count++;
        }
    }
    printf("interrupts fired : %d\n", total);
    printf("seen with a flag : %d\n", by_flag);
    printf("seen with counter: %u\n", by_count);
    return 0;
}
