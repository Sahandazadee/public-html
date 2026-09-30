#include <stdio.h>
#include "hal_host.h"
#include "logger.h"

int main(void)
{
    logger_t lg;
    logger_init(&lg, hal_host_get());

    for (uint32_t t = 0; t < 20000u; t += 10u) {    /* ۲۰ ثانیهٔ ساختگی، گام ۱۰ms */
        hal_host_advance(10u);
        logger_poll(&lg);
    }
    printf("-- done: %u samples\n", (unsigned)lg.total);
    return 0;
}
