#include <stdio.h>

typedef enum {
    STATE_IDLE,
    STATE_RUN,
    STATE_ERROR,
    STATE_COUNT                     // تعداد حالت‌ها؛ حالت واقعی نیست
} state_t;

static const char *const state_names[STATE_COUNT] = {
    [STATE_IDLE]  = "IDLE",
    [STATE_RUN]   = "RUN",
    [STATE_ERROR] = "ERROR",
};

int main(void)
{
    for (int s = 0; s < STATE_COUNT; s++) {
        printf("%d = %s\n", s, state_names[s]);
    }
    printf("STATE_COUNT = %d\n", (int)STATE_COUNT);
    return 0;
}
