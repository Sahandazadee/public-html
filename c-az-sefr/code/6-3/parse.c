#include <assert.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

#define MAX_DIGITS 3U

typedef enum {
    PARSE_OK = 0,
    PARSE_NULL,
    PARSE_EMPTY,
    PARSE_BAD_CHAR,
    PARSE_RANGE
} parse_status_t;

static const char *status_name(parse_status_t s)
{
    switch (s) {
    case PARSE_OK:       return "OK";
    case PARSE_NULL:     return "NULL";
    case PARSE_EMPTY:    return "EMPTY";
    case PARSE_BAD_CHAR: return "BAD_CHAR";
    case PARSE_RANGE:    return "RANGE";
    default:             return "?";
    }
}

/* متن «۰ تا ۱۰۰» را به عدد تبدیل می‌کند؛ در هر حالت خطا *out دست‌نخورده می‌ماند */
static parse_status_t parse_percent(const char *text, uint8_t *out)
{
    if ((text == NULL) || (out == NULL)) {
        return PARSE_NULL;
    }
    if (text[0] == '\0') {
        return PARSE_EMPTY;
    }

    uint32_t value = 0U;
    size_t i = 0U;
    while (text[i] != '\0') {
        if (i >= MAX_DIGITS) {
            return PARSE_RANGE;             /* خیلی بلند است */
        }
        if ((text[i] < '0') || (text[i] > '9')) {
            return PARSE_BAD_CHAR;
        }
        value = (value * 10U) + (uint32_t)(text[i] - '0');
        i++;
    }
    assert(value <= 999U);                  /* ناوردا: حداکثر سه رقم */
    if (value > 100U) {
        return PARSE_RANGE;
    }
    *out = (uint8_t)value;
    return PARSE_OK;
}

int main(void)
{
    const char *inputs[] = { "42", "100", "101", "", "4x2", "1234", NULL };
    uint8_t pct = 0U;

    for (size_t k = 0U; k < (sizeof(inputs) / sizeof(inputs[0])); k++) {
        parse_status_t st = parse_percent(inputs[k], &pct);
        printf("%-6s -> %-8s (pct=%u)\n",
               (inputs[k] != NULL) ? inputs[k] : "(null)", status_name(st), (unsigned)pct);
    }
    return 0;
}
