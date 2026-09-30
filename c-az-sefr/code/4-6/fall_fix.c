#include <stdio.h>

typedef enum { S_IDLE, S_RUN, S_ERROR } state_t;
typedef enum { EV_START, EV_FAULT, EV_RESET } event_t;

static const char *const state_name[] = { "IDLE", "RUN", "ERROR" };
static const char *const event_name[] = { "START", "FAULT", "RESET" };

static state_t handle(state_t s, event_t ev)
{
    switch (s) {
    case S_IDLE:
        if (ev == EV_START) {
            return S_RUN;
        }
        break;
    case S_RUN:
        if (ev == EV_FAULT) {
            s = S_ERROR;
        }
        break;
    case S_ERROR:
        if (ev == EV_RESET) {
            s = S_IDLE;
        }
        break;
    }
    return s;
}

int main(void)
{
    static const event_t events[] = { EV_START, EV_RESET, EV_FAULT, EV_RESET };
    state_t s = S_IDLE;

    for (unsigned i = 0; i < sizeof(events) / sizeof(events[0]); i++) {
        state_t next = handle(s, events[i]);
        printf("%-5s: %-5s -> %s\n", event_name[events[i]], state_name[s], state_name[next]);
        s = next;
    }
    return 0;
}
