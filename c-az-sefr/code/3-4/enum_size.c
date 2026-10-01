#include <stdio.h>

typedef enum { STATE_IDLE, STATE_RUN, STATE_ERROR } state_t;

int main(void)
{
    printf("sizeof(state_t) = %zu\n", sizeof(state_t));
    return 0;
}
