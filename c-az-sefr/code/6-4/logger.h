#ifndef LOGGER_H
#define LOGGER_H

#include <stddef.h>
#include <stdint.h>

#define LOG_MAX_TEXT 62U            /* حداکثر طول متن (بدون \r\n) */

/* لایهٔ انتقال (مثلا UART): تعداد بایت‌های واقعا فرستاده‌شده را برمی‌گرداند؛ منفی = خطا */
typedef struct {
    int   (*write)(void *ctx, const uint8_t *data, size_t n);
    void   *ctx;
} tx_ops_t;

typedef enum {
    LOG_OK = 0,
    LOG_ERR_ARG = -1,
    LOG_ERR_TOO_LONG = -2,
    LOG_ERR_IO = -3
} log_status_t;

/* متن را همراه با "\r\n" می‌فرستد و ارسال ناقص را ادامه می‌دهد */
log_status_t log_line(const tx_ops_t *tx, const char *text);

#endif /* LOGGER_H */
