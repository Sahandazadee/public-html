#ifndef BUTTON_H
#define BUTTON_H

#include <stdbool.h>

#ifndef BTN_STABLE_TICKS
#define BTN_STABLE_TICKS 3U     /* چند tick پشت‌سرهم یکسان بماند تا معتبر باشد */
#endif

typedef enum {
    BTN_RELEASED,           /* رها و پایدار */
    BTN_PRESS_CANDIDATE,    /* تازه پایین دیده شد؛ منتظر تأیید */
    BTN_PRESSED,            /* پایین و پایدار */
    BTN_RELEASE_CANDIDATE   /* تازه بالا دیده شد؛ منتظر تأیید */
} btn_state_t;

typedef enum {
    BTN_EV_NONE,
    BTN_EV_PRESS,           /* یک بار، لحظهٔ فشرده شدن معتبر */
    BTN_EV_RELEASE          /* یک بار، لحظهٔ رها شدن معتبر */
} btn_event_t;

typedef struct {
    btn_state_t state;
    unsigned count;         /* چند نمونهٔ یکسان پشت‌سرهم دیده‌ایم */
} button_t;

void button_init(button_t *b);
btn_event_t button_step(button_t *b, bool raw_pressed);   /* هر tick یک بار */
const char *button_state_name(btn_state_t s);

#endif /* BUTTON_H */
