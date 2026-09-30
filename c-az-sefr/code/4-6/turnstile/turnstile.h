#ifndef TURNSTILE_H
#define TURNSTILE_H

typedef enum {
    ST_LOCKED,
    ST_UNLOCKED
} turn_state_t;

typedef enum {
    EV_COIN,
    EV_PUSH
} turn_event_t;

typedef struct {
    turn_state_t state;
    unsigned coins;         /* چند سکه گرفته شده */
    unsigned passed;        /* چند نفر رد شده‌اند */
} turnstile_t;

void turnstile_init(turnstile_t *t);
void turnstile_handle(turnstile_t *t, turn_event_t ev);
const char *turn_state_name(turn_state_t s);
const char *turn_event_name(turn_event_t e);

#endif /* TURNSTILE_H */
