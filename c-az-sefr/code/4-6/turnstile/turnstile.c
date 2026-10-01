#include "turnstile.h"

void turnstile_init(turnstile_t *t)
{
    t->state = ST_LOCKED;
    t->coins = 0;
    t->passed = 0;
}

void turnstile_handle(turnstile_t *t, turn_event_t ev)
{
    switch (t->state) {
    case ST_LOCKED:
        if (ev == EV_COIN) {
            t->coins++;
            t->state = ST_UNLOCKED;     // سکه انداختی: قفل باز شد
        }
        break;                          // فشار به قفل: هیچ اتفاقی نمی‌افتد

    case ST_UNLOCKED:
        if (ev == EV_PUSH) {
            t->passed++;
            t->state = ST_LOCKED;       // یک نفر رد شد: دوباره قفل
        } else if (ev == EV_COIN) {
            t->coins++;                 // سکهٔ اضافه: می‌گیریم، حالت عوض نمی‌شود
        }
        break;

    default:                            // مقدار خراب (باگ، bit-flip): امن‌ترین حالت
        t->state = ST_LOCKED;
        break;
    }
}

const char *turn_state_name(turn_state_t s)
{
    static const char *const names[] = { "LOCKED", "UNLOCKED" };
    return ((unsigned)s < sizeof names / sizeof names[0]) ? names[s] : "?";
}

const char *turn_event_name(turn_event_t e)
{
    static const char *const names[] = { "COIN", "PUSH" };
    return ((unsigned)e < sizeof names / sizeof names[0]) ? names[e] : "?";
}
