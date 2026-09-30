#include <stdio.h>

int main(void)
{
    /* هر عدد یک بار پرسیدن PC13 است: 1 = رها، 0 = فشرده (یک فشردن واقعی با پرش‌ها) */
    const int s[] = {1,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,1,1};
    const int n = (int)(sizeof s / sizeof s[0]);

    int level = 0;                  /* هر نمونهٔ صفر را بشمار */
    int edge = 0;                   /* هر رفتن از ۱ به ۰ را بشمار */
    int stable = 0;                 /* فقط وقتی ۴ صفر پشت‌سرهم دیدی بشمار */
    int prev = 1, run0 = 0, armed = 1;

    for (int i = 0; i < n; i++) {
        if (s[i] == 0) {
            level++;
            run0++;
        } else {
            run0 = 0;
            armed = 1;
        }
        if (prev == 1 && s[i] == 0) {
            edge++;
        }
        if (run0 == 4 && armed) {
            stable++;
            armed = 0;
        }
        prev = s[i];
    }
    printf("level counting : %d\n", level);
    printf("edge counting  : %d\n", edge);
    printf("debounced (4)  : %d\n", stable);
    return 0;
}
