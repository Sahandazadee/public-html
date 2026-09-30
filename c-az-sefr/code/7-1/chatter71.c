#include <stdio.h>
#include <stdint.h>

#define HIGH  3000
#define HYST  200

/* دمایی که نزدیک آستانه نوسان کوچک دارد (نویز سنسور) */
static const int readings[12] = {
    2995, 3005, 2998, 3004, 2996, 3006, 2997, 3003, 2999, 3005, 2994, 3002
};

static int count_changes(int hysteresis)
{
    int alarm = 0, changes = 0;
    for (int i = 0; i < 12; i++) {
        int t = readings[i];
        if (!alarm && t >= HIGH) {
            alarm = 1;
            changes++;
        } else if (alarm && t <= HIGH - hysteresis) {
            alarm = 0;
            changes++;
        }
    }
    return changes;
}

int main(void)
{
    printf("without hysteresis: %d state changes\n", count_changes(0));
    printf("with hysteresis   : %d state changes\n", count_changes(HYST));

    int h = 0;
    while (count_changes(h) != 1) {              /* کوچک‌ترین پسماندی که لرزش را حذف می‌کند */
        h++;
    }
    printf("smallest working hysteresis: %d\n", h);
    return 0;
}
