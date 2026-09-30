#include <stdio.h>
#include <stdint.h>

static uint32_t adc_to_mv(uint16_t raw)
{
    return (uint32_t)raw * 3300u / 4095u;
}

static int mv_to_percent(uint32_t mv)
{
    return (int)(mv * 100u / 3300u);
}

static void show(uint16_t raw)
{
    uint32_t mv = adc_to_mv(raw);
    printf("raw=%4u  mv=%4u  percent=%3d\n", (unsigned)raw, (unsigned)mv, mv_to_percent(mv));
}

int main(void)
{
    show(0);
    show(2048);
    show(4095);
    return 0;
}
