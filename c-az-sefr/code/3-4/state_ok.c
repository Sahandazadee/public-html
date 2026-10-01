#include <stdio.h>

typedef enum { STATE_IDLE, STATE_RUN, STATE_ERROR } state_t;

static const char *describe(state_t s)
{
    switch (s) {
    case STATE_IDLE:  return "idle";
    case STATE_RUN:   return "run";
    case STATE_ERROR: return "error";
    }
    return "INVALID";   // مسیر دفاعی: حالت خراب
}

int main(void)
{
    printf("%s\n", describe(STATE_RUN));
    printf("%s\n", describe((state_t)42));
    return 0;
}
