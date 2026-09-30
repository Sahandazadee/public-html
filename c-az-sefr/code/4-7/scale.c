#include <stdio.h>
#include <stdint.h>

#define VREF_MV 3300u
#define ADC_MAX 4095u

/* ADC 12 بیتی به میلی‌ولت، با گرد کردن به نزدیک‌ترین */
static uint32_t adc_to_mv(uint16_t raw)
{
    return ((uint32_t)raw * VREF_MV + ADC_MAX / 2u) / ADC_MAX;
}

/* همان محاسبه با بریدن (بدون گرد کردن) */
static uint32_t adc_to_mv_trunc(uint16_t raw)
{
    return ((uint32_t)raw * VREF_MV) / ADC_MAX;
}

int main(void)
{
    const uint16_t samples[] = { 0, 1, 620, 2048, 4095 };

    for (unsigned i = 0; i < sizeof samples / sizeof samples[0]; i++) {
        printf("raw=%4u  trunc=%4u mV  round=%4u mV\n",
               (unsigned)samples[i],
               (unsigned)adc_to_mv_trunc(samples[i]),
               (unsigned)adc_to_mv(samples[i]));
    }
    return 0;
}
