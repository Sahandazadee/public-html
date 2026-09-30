#include <stdio.h>
#include "button.h"

int main(void)
{
    /* نمونه‌های خام هر ۱ms: ۱ = پایین. ابتدا و انتها پرش دارد */
    static const bool raw[] = {
        0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0
    };
    button_t btn;

    button_init(&btn);
    for (unsigned t = 0; t < sizeof(raw) / sizeof(raw[0]); t++) {
        btn_event_t ev = button_step(&btn, raw[t]);
        printf("t=%2u raw=%d %-18s", t, raw[t], button_state_name(btn.state));
        if (ev == BTN_EV_PRESS) {
            printf(" <== PRESS");
        } else if (ev == BTN_EV_RELEASE) {
            printf(" <== RELEASE");
        }
        printf("\n");
    }
    return 0;
}
