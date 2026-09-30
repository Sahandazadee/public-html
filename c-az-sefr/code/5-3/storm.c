#include <stdio.h>

static unsigned pending;                  /* مثل بیت ۱۳ از EXTI_PR */

static void run(int isr_clears)
{
    unsigned isr_calls = 0, main_steps = 0;

    pending = 1;                          /* یک لبه آمده */
    for (int tick = 0; tick < 1000; tick++) {
        if (pending) {                    /* تا پاک نشود، CPU دوباره وارد ISR می‌شود */
            isr_calls++;
            if (isr_clears) {
                pending = 0;
            }
        } else {
            main_steps++;
        }
    }
    printf("clears PR: %-3s -> ISR ran %4u times, main ran %3u steps\n",
           isr_clears ? "yes" : "no", isr_calls, main_steps);
}

int main(void)
{
    run(1);
    run(0);
    return 0;
}
