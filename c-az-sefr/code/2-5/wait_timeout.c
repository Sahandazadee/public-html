#include <stdio.h>

int main(void)
{
    int ready_at = 7;
    int timeout = 5;
    int attempts = 0;
    int ready = 0;

    while (attempts < timeout && !ready) {
        attempts = attempts + 1;
        if (attempts >= ready_at) {
            ready = 1;
        }
    }

    if (ready) {
        printf("sensor ready after %d checks\n", attempts);
    } else {
        printf("timeout after %d checks\n", attempts);
    }
    return 0;
}
