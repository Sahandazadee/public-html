#include <stdio.h>

typedef enum { G_CLOSED, G_OPENING, G_OPEN, G_CLOSING } garage_state_t;
typedef enum { GE_BUTTON, GE_LIMIT_OPEN, GE_LIMIT_CLOSED, GE_OBSTACLE } garage_event_t;

static const char *const state_name[] = { "CLOSED", "OPENING", "OPEN", "CLOSING" };
static const char *const event_name[] = { "BUTTON", "LIMIT_OPEN", "LIMIT_CLOSED", "OBSTACLE" };

static garage_state_t handle(garage_state_t s, garage_event_t ev)
{
    switch (s) {
    case G_CLOSED:
        if (ev == GE_BUTTON) {
            return G_OPENING;
        }
        break;
    case G_OPENING:
        if (ev == GE_LIMIT_OPEN) {
            return G_OPEN;
        }
        break;
    case G_OPEN:
        if (ev == GE_BUTTON) {
            return G_CLOSING;
        }
        break;
    case G_CLOSING:
        if (ev == GE_LIMIT_CLOSED) {
            return G_CLOSED;
        }
        if (ev == GE_OBSTACLE) {
            return G_OPENING;               // مانع: برگرد و باز کن
        }
        break;
    default:                                // مقدار خراب: به حالت امن (بسته)
        return G_CLOSED;
    }
    return s;                               // رویدادی که این حالت نمی‌شناسد: نادیده
}

int main(void)
{
    static const garage_event_t events[] = {
        GE_BUTTON, GE_BUTTON, GE_LIMIT_OPEN, GE_BUTTON,
        GE_OBSTACLE, GE_LIMIT_OPEN, GE_BUTTON, GE_LIMIT_CLOSED
    };
    garage_state_t s = G_CLOSED;

    for (unsigned i = 0; i < sizeof(events) / sizeof(events[0]); i++) {
        garage_state_t next = handle(s, events[i]);
        printf("%-12s: %-7s -> %s\n", event_name[events[i]], state_name[s], state_name[next]);
        s = next;
    }
    return 0;
}
