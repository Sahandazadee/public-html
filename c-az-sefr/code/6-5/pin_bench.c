#include <stdint.h>

#define GPIOA_BSRR (*(volatile uint32_t *)0x40020018u)
#define PIN_SET    (1u << 5)            /* PA5 = 1 */
#define PIN_CLR    (1u << (5 + 16))     /* PA5 = 0 */

extern void work_under_test(void);

void bench_pin(void)
{
    GPIOA_BSRR = PIN_SET;
    work_under_test();
    GPIOA_BSRR = PIN_CLR;
}
