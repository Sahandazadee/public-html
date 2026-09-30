#include "temp.h"

centi_t temp_from_raw(uint16_t raw)
{
    if (raw > ADC_MAX) {
        raw = ADC_MAX;                          /* عدد نامعتبر را محدود کن */
    }
    int32_t span = TEMP_MAX_CENTI - TEMP_MIN_CENTI;
    int32_t centi = TEMP_MIN_CENTI + ((int32_t)raw * span) / (int32_t)ADC_MAX;
    return (centi_t)centi;
}

/* متن را در buf می‌نویسد (با '\0' پایانی) و طول کامل متن را برمی‌گرداند */
static size_t put_text(char *buf, size_t size, const char *text, size_t len)
{
    if (size > 0u) {
        size_t n = (len < size - 1u) ? len : size - 1u;
        for (size_t i = 0; i < n; i++) {
            buf[i] = text[i];
        }
        buf[n] = '\0';
    }
    return len;
}

size_t u32_to_dec(char *buf, size_t size, uint32_t v)
{
    char rev[10];                               /* حداکثر ۱۰ رقم برای uint32_t */
    size_t n = 0;
    do {
        rev[n++] = (char)('0' + (v % 10u));
        v /= 10u;
    } while (v != 0u);

    char text[10];
    for (size_t i = 0; i < n; i++) {
        text[i] = rev[n - 1u - i];              /* برعکس کردن رقم‌ها */
    }
    return put_text(buf, size, text, n);
}

size_t temp_format(char *buf, size_t size, centi_t t)
{
    char text[16];
    size_t n = 0;
    uint32_t mag = (t < 0) ? (uint32_t)(-(int32_t)t) : (uint32_t)t;

    if (t < 0) {
        text[n++] = '-';
    }
    n += u32_to_dec(&text[n], sizeof text - n, mag / 100u);
    text[n++] = '.';
    text[n++] = (char)('0' + (mag % 100u) / 10u);
    text[n++] = (char)('0' + (mag % 10u));
    return put_text(buf, size, text, n);
}
