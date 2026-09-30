#include <stdint.h>

#define DEMCR       (*(volatile uint32_t *)0xE000EDFCu)
#define DWT_CTRL    (*(volatile uint32_t *)0xE0001000u)
#define DWT_CYCCNT  (*(volatile uint32_t *)0xE0001004u)

#define DEMCR_TRCENA        (1u << 24)
#define DWT_CTRL_CYCCNTENA  (1u << 0)

void cyc_init(void)
{
    DEMCR |= DEMCR_TRCENA;              /* روشن کردن DWT */
    DWT_CYCCNT = 0u;                    /* شمارنده از صفر */
    DWT_CTRL |= DWT_CTRL_CYCCNTENA;     /* شروع شمردن */
}

static inline uint32_t cyc_now(void)
{
    return DWT_CYCCNT;
}

volatile uint32_t n_in = 1000u;         /* ورودی: کامپایلر نباید مقدارش را بداند */
volatile uint32_t sink;                 /* نتیجه: کامپایلر نباید بتواند حذفش کند */

static uint32_t work(uint32_t n)
{
    uint32_t x = 0;
    for (uint32_t i = 0; i < n; i++) {
        x += i * i;
    }
    return x;
}

uint32_t measure(void)
{
    uint32_t t0 = cyc_now();
    sink = work(n_in);
    uint32_t t1 = cyc_now();
    return t1 - t0;                     /* بدون علامت: سرریز شمارنده هم درست حساب می‌شود */
}

uint32_t measure_overhead(void)
{
    uint32_t t0 = cyc_now();
    uint32_t t1 = cyc_now();
    return t1 - t0;                     /* هزینهٔ خود اندازه‌گیری */
}
