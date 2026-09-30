#include <stdio.h>
#include "traffic.h"

typedef void (*action_fn)(void);

/* جدول گذار: سطر = حالت فعلی، ستون = رویداد، خانه = حالت بعدی */
static const light_state_t next_state[S_COUNT][E_COUNT] = {
    /*             E_TIMEOUT  E_PED_BUTTON */
    /* S_GREEN  */ { S_YELLOW, S_YELLOW },
    /* S_YELLOW */ { S_RED,    S_YELLOW },
    /* S_RED    */ { S_GREEN,  S_RED    },
};

static const unsigned duration[S_COUNT] = { 4, 2, 3 };

static void enter_green(void)  { printf("  enter GREEN\n"); }
static void enter_yellow(void) { printf("  enter YELLOW\n"); }
static void enter_red(void)    { printf("  enter RED (walk on)\n"); }
static void exit_red(void)     { printf("  exit RED (walk off)\n"); }

static const action_fn entry_action[S_COUNT] = { enter_green, enter_yellow, enter_red };
static const action_fn exit_action[S_COUNT]  = { NULL, NULL, exit_red };

static void go_to(light_t *l, light_state_t next)
{
    if (exit_action[l->state] != NULL) {
        exit_action[l->state]();
    }
    l->state = next;
    l->remaining = duration[next];
    if (entry_action[next] != NULL) {
        entry_action[next]();
    }
}

void light_init(light_t *l)
{
    l->state = S_RED;
    l->remaining = duration[S_RED];
    entry_action[S_RED]();
}

void light_dispatch(light_t *l, light_event_t ev)
{
    light_state_t next = next_state[l->state][ev];
    if (next != l->state) {
        go_to(l, next);
    }
}

void light_tick(light_t *l)
{
    if (l->remaining > 0U) {
        l->remaining--;
    }
    if (l->remaining == 0U) {
        light_dispatch(l, E_TIMEOUT);
    }
}

const char *light_state_name(light_state_t s)
{
    static const char *const names[S_COUNT] = { "GREEN", "YELLOW", "RED" };
    return names[s];
}
