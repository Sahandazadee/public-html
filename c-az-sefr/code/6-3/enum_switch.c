#include <stdio.h>

typedef enum { MODE_IDLE, MODE_RUN, MODE_SLEEP } run_mode_t;

static const char *name(run_mode_t m)
{
    switch (m) {
    case MODE_IDLE: return "idle";
    case MODE_RUN:  return "run";
    }
    return "?";
}

int main(void)
{
    printf("%s\n", name(MODE_SLEEP));
    return 0;
}
