#include "logger.h"
#include <string.h>

log_status_t log_line(const tx_ops_t *tx, const char *text)
{
    uint8_t buf[LOG_MAX_TEXT + 2U];
    size_t  len;
    size_t  sent = 0U;

    if ((tx == NULL) || (tx->write == NULL) || (text == NULL)) {
        return LOG_ERR_ARG;
    }
    len = strlen(text);
    if (len > LOG_MAX_TEXT) {
        return LOG_ERR_TOO_LONG;
    }
    memcpy(buf, text, len);
    buf[len] = (uint8_t)'\r';
    buf[len + 1U] = (uint8_t)'\n';
    len += 2U;

    while (sent < len) {                        // هر دور لااقل یک بایت پیش می‌رود
        int n = tx->write(tx->ctx, &buf[sent], len - sent);
        if (n <= 0) {
            return LOG_ERR_IO;
        }
        sent += (size_t)n;
    }
    return LOG_OK;
}
