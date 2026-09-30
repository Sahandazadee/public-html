#include <stdint.h>

static uint32_t ready;                 /* بدون volatile */

void wait_ready(void)
{
    while (ready == 0u) {
    }
}
