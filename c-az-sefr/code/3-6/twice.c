#include <stdint.h>

#define DR_PLAIN    (*(uint32_t *)0x40004404u)
#define DR_VOLATILE (*(volatile uint32_t *)0x40004404u)

void send_plain(void)
{
    DR_PLAIN = 'H';
    DR_PLAIN = 'i';
}

void send_volatile(void)
{
    DR_VOLATILE = 'H';
    DR_VOLATILE = 'i';
}
