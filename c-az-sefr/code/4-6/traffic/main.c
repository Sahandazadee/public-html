#include <stdio.h>
#include "traffic.h"

int main(void)
{
    /* 'T' = یک tick گذشت، 'P' = عابر دکمه را زد */
    const char script[] = "TTTTTPTTTTT";
    light_t light;

    light_init(&light);
    for (unsigned i = 0; script[i] != '\0'; i++) {
        printf("%c:\n", script[i]);
        if (script[i] == 'T') {
            light_tick(&light);
        } else {
            light_dispatch(&light, E_PED_BUTTON);
        }
        printf("  now %s, remaining=%u\n", light_state_name(light.state), light.remaining);
    }
    return 0;
}
