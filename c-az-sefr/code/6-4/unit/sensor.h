#ifndef SENSOR_H
#define SENSOR_H

#include <stdint.h>

#define SENSOR_ADDR            0x76U    /* آدرس I2C */
#define SENSOR_REG_ID          0xD0U    /* ثبات شناسهٔ تراشه */
#define SENSOR_CHIP_ID         0x60U    /* مقداری که باید در آن ثبات باشد */
#define SENSOR_RETRIES         3U
#define SENSOR_RETRY_DELAY_MS  2U

/* لایهٔ انتقال: هر برد یک نسخه از این تابع می‌دهد (I2C واقعی یا mock) */
typedef struct {
    int   (*read_reg)(void *ctx, uint8_t dev, uint8_t reg, uint8_t *value);  /* ۰ = موفق */
    void   *ctx;
} bus_ops_t;

typedef enum {
    SENSOR_OK = 0,
    SENSOR_ERR_ARG,     /* اشاره‌گر NULL */
    SENSOR_ERR_BUS,     /* خطای ارتباط پس از چند بار تلاش */
    SENSOR_ERR_ID       /* تراشه جواب داد ولی شناسه اشتباه است */
} sensor_status_t;

sensor_status_t sensor_probe(const bus_ops_t *bus);

#endif /* SENSOR_H */
