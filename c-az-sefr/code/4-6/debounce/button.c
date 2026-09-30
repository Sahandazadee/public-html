#include "button.h"

void button_init(button_t *b)
{
    b->state = BTN_RELEASED;
    b->count = 0;
}

btn_event_t button_step(button_t *b, bool raw_pressed)
{
    btn_event_t ev = BTN_EV_NONE;

    switch (b->state) {
    case BTN_RELEASED:
        if (raw_pressed) {
            b->state = BTN_PRESS_CANDIDATE;
            b->count = 1;
        }
        break;

    case BTN_PRESS_CANDIDATE:
        if (!raw_pressed) {
            b->state = BTN_RELEASED;            // فقط نویز بود
        } else if (++b->count >= BTN_STABLE_TICKS) {
            b->state = BTN_PRESSED;
            ev = BTN_EV_PRESS;                  // معتبر شد
        }
        break;

    case BTN_PRESSED:
        if (!raw_pressed) {
            b->state = BTN_RELEASE_CANDIDATE;
            b->count = 1;
        }
        break;

    case BTN_RELEASE_CANDIDATE:
        if (raw_pressed) {
            b->state = BTN_PRESSED;             // پرش دکمه، هنوز پایین است
        } else if (++b->count >= BTN_STABLE_TICKS) {
            b->state = BTN_RELEASED;
            ev = BTN_EV_RELEASE;
        }
        break;
    }
    return ev;
}

const char *button_state_name(btn_state_t s)
{
    static const char *const names[] = {
        "RELEASED", "PRESS_CANDIDATE", "PRESSED", "RELEASE_CANDIDATE"
    };
    return names[s];
}
