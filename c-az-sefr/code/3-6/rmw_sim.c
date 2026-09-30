#include <stdio.h>
#include <stdint.h>

static volatile uint32_t odr;           // رجیستر خروجی ساختگی
static uint32_t pr;                     // رجیستر «در انتظار» ساختگی

static void bsrr_write(uint32_t v)      // رفتار BSRR: نیمهٔ پایین set، نیمهٔ بالا reset
{
    odr = (odr | (v & 0xFFFFu)) & ~((v >> 16) & 0xFFFFu);
}

static void pr_write(uint32_t v)        // رفتار write-1-to-clear: هر بیتِ ۱ پاک می‌شود
{
    pr &= ~v;
}

static void interrupt_sets_pin0(void)   // وقفه‌ای که وسط کار پین ۰ را روشن می‌کند
{
    odr = odr | 1u;
}

int main(void)
{
    /* الف) خواندن-تغییر-نوشتن: وقفه وسط کار می‌آید */
    odr = 0;
    uint32_t tmp = odr;                 // ۱) خواندن
    interrupt_sets_pin0();              // وقفه: ODR الان 0x0001
    tmp = tmp | (1u << 5);              // ۲) تغییر
    odr = tmp;                          // ۳) نوشتن: پین ۰ گم شد
    printf("read-modify-write: 0x%04x\n", (unsigned)odr);

    /* ب) همان کار با BSRR: یک نوشتن، بدون خواندن */
    odr = 0;
    interrupt_sets_pin0();
    bsrr_write(1u << 5);
    printf("BSRR             : 0x%04x\n", (unsigned)odr);

    /* پ) پاک کردن پرچم write-1-to-clear */
    pr = (1u << 5) | (1u << 13);        // دو پرچم فعال
    pr_write(pr | (1u << 13));          // غلط: PR |= بیت ۱۳ (کل مقدار برمی‌گردد)
    printf("PR |= bit13      : 0x%04x\n", (unsigned)pr);
    pr = (1u << 5) | (1u << 13);
    pr_write(1u << 13);                 // درست: فقط بیت ۱۳
    printf("PR  = bit13      : 0x%04x\n", (unsigned)pr);
    return 0;
}
