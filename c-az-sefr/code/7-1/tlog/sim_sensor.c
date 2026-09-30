#include "sim_sensor.h"
#include "config.h"

/* موج دمای ساختگی به صدم درجه؛ بعد از آخرین عضو دوباره از اول می‌شود */
static const centi_t wave[20] = {
    2210, 2240, 2295, 2380, 2510, 2680, 2890, 3050, 3210, 3300,
    3260, 3120, 2980, 2850, 2700, 2560, 2430, 2330, 2260, 2225
};

static uint32_t next_index;

bool sim_sensor_read(uint16_t *raw)
{
    int32_t centi = wave[next_index];
    next_index = (next_index + 1u) % 20u;
    /* معکوس تبدیل temp_from_raw، همان‌طور که ADC واقعی عدد می‌داد */
    int32_t span = TEMP_MAX_CENTI - TEMP_MIN_CENTI;
    *raw = (uint16_t)(((centi - TEMP_MIN_CENTI) * (int32_t)ADC_MAX + span / 2) / span);
    return true;
}
