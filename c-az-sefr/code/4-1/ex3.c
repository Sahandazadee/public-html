#include <stdint.h>
#include <stdio.h>

#define BIT(n)            (1UL << (n))
#define SET_BIT(r, n)     ((r) |= BIT(n))
#define CLR_BIT(r, n)     ((r) &= ~BIT(n))
#define TOGGLE_BIT(r, n)  ((r) ^= BIT(n))
#define TEST_BIT(r, n)    (((r) >> (n)) & 1UL)

#define LED_PIN 5U

static uint32_t fake_odr = 0;

int main(void)
{
    SET_BIT(fake_odr, LED_PIN);
    printf("after set    : 0x%04lX\n", (unsigned long)fake_odr);
    TOGGLE_BIT(fake_odr, LED_PIN);
    printf("after toggle : 0x%04lX\n", (unsigned long)fake_odr);
    SET_BIT(fake_odr, 0);
    SET_BIT(fake_odr, LED_PIN);
    CLR_BIT(fake_odr, 0);
    printf("final        : 0x%04lX, led=%lu\n", (unsigned long)fake_odr, TEST_BIT(fake_odr, LED_PIN));
    printf("BSRR off     : 0x%08lX\n", BIT(LED_PIN + 16U));
    return 0;
}
