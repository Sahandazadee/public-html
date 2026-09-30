#include <stdio.h>
#include "turnstile.h"

int main(void)
{
    static const turn_event_t events[] = {
        EV_PUSH, EV_COIN, EV_COIN, EV_PUSH, EV_PUSH, EV_COIN, EV_PUSH
    };
    turnstile_t gate;

    turnstile_init(&gate);
    for (unsigned i = 0; i < sizeof(events) / sizeof(events[0]); i++) {
        turn_state_t before = gate.state;
        turnstile_handle(&gate, events[i]);
        printf("%-4s: %-8s -> %s\n", turn_event_name(events[i]),
               turn_state_name(before), turn_state_name(gate.state));
    }
    printf("coins=%u passed=%u\n", gate.coins, gate.passed);
    return 0;
}
