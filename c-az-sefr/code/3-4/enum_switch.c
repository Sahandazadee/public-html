#include <stdio.h>

typedef enum {
    STATE_IDLE,
    STATE_RUN,
    STATE_ERROR
} state_t;

int main(void)
{
    state_t s = STATE_RUN;
    switch (s) {
    case STATE_IDLE:
        printf("idle\n");
        break;
    case STATE_RUN:
        printf("run\n");
        break;
    }
    return 0;
}
