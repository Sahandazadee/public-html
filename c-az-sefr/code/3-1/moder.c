#include <stdio.h>
#include <stdint.h>

// هر پایه دو بیت دارد: بیت‌های (2*pin+1 .. 2*pin)
static uint32_t set_mode(uint32_t moder, unsigned pin, uint32_t mode)
{
    moder &= ~(3U << (pin * 2U));           // دو بیت پایه را پاک کن
    moder |= (mode << (pin * 2U));          // حالت جدید را بگذار
    return moder;
}

int main(void)
{
    uint32_t moder = 0xA8000000U;           // مقدار پس از ریست GPIOA

    uint32_t wrong = 1U << 10;              // اشتباه: همه را دور می‌ریزد
    uint32_t right = set_mode(moder, 5, 1U);// درست: فقط PA5

    printf("reset  = 0x%08X\n", (unsigned)moder);
    printf("wrong  = 0x%08X\n", (unsigned)wrong);
    printf("right  = 0x%08X\n", (unsigned)right);

    uint32_t odr = 0;
    odr ^= (1U << 5);
    printf("odr    = 0x%08X\n", (unsigned)odr);
    odr ^= (1U << 5);
    printf("odr    = 0x%08X\n", (unsigned)odr);
    return 0;
}
