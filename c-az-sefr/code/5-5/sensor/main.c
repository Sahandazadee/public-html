#include <stdio.h>

#include "bme.h"
#include "mock_bus.h"

static const char *status_text(bme_status_t st)
{
    switch (st) {
    case BME_OK:          return "OK";
    case BME_ERR_BUS:     return "bus error";
    case BME_ERR_ID:      return "wrong chip id";
    case BME_ERR_TIMEOUT: return "timeout";
    case BME_ERR_NODATA:  return "no data";
    }
    return "?";
}

int main(void)
{
    mock_dev_t fake;
    mock_dev_init(&fake, 0x76u);
    bus_t bus = mock_dev_bus(&fake);

    bme_t sensor;
    bme_init(&sensor, &bus, 0x76u);

    printf("check id: %s\n", status_text(bme_check_id(&sensor)));
    printf("trigger:  %s\n", status_text(bme_trigger_forced(&sensor)));
    printf("wait:     %s\n", status_text(bme_wait_ready(&sensor, 20u)));

    int32_t raw = 0;
    bme_status_t st = bme_read_temp_raw(&sensor, &raw);
    printf("temp raw: %s, %ld (0x%05lX)\n", status_text(st), (long)raw, (unsigned long)raw);

    fake.regs[0xF3] = 0x08u;
    printf("busy sensor, wait: %s\n", status_text(bme_wait_ready(&sensor, 3u)));

    bme_t wrong;
    bme_init(&wrong, &bus, 0x77u);
    printf("check id at 0x77: %s\n", status_text(bme_check_id(&wrong)));
    return 0;
}
