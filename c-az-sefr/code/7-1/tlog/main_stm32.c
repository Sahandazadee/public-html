#include "hal_stm32.h"
#include "logger.h"

int main(void)
{
    static logger_t lg;                         /* static: در .bss، نه روی پشته */
    logger_init(&lg, hal_stm32_init());
    for (;;) {
        logger_poll(&lg);
    }
}
