#include <stdio.h>

#define STATE_LIST(X) \
    X(IDLE)           \
    X(SAMPLING)       \
    X(ALARM)

#define AS_ENUM(name)   STATE_##name,
#define AS_TEXT(name)   #name,

enum state { STATE_LIST(AS_ENUM) STATE_COUNT };

static const char *const state_name[] = { STATE_LIST(AS_TEXT) };

int main(void)
{
    for (int s = 0; s < STATE_COUNT; s++) {
        printf("%d = %s\n", s, state_name[s]);
    }
    return 0;
}
