#include <stdio.h>
#include <stdint.h>

static uint32_t fake_gpio[8];           // هشت کلمهٔ ۳۲ بیتی به جای رجیسترهای واقعی
#define FAKE_BASE ((uintptr_t)fake_gpio)
#define FAKE_ODR  (*(volatile uint32_t *)(FAKE_BASE + 0x14u))

int main(void)
{
    FAKE_ODR = 0;
    FAKE_ODR |= 1u << 5;                // بیت ۵ را روشن کن
    FAKE_ODR |= 1u << 0;

    volatile uint32_t *odr = (volatile uint32_t *)(FAKE_BASE + 0x14u);
    printf("ODR = 0x%08x\n", (unsigned)*odr);
    printf("offset = %u bytes from base\n", (unsigned)((uintptr_t)odr - FAKE_BASE));
    printf("fake_gpio[5] = 0x%08x\n", (unsigned)fake_gpio[5]);
    return 0;
}
