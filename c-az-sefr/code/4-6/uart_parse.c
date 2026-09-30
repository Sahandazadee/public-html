#include <stdio.h>

typedef enum { P_WAIT_START, P_DIGITS } pstate_t;
typedef enum { R_NONE, R_OK, R_BAD } presult_t;

typedef struct {
    pstate_t state;
    unsigned value;
    unsigned digits;
} parser_t;

static presult_t feed(parser_t *p, char c)
{
    if (c == '$') {                         // شروع تازه، از هر حالتی
        p->state = P_DIGITS;
        p->value = 0;
        p->digits = 0;
        return R_NONE;
    }
    switch (p->state) {
    case P_WAIT_START:
        break;                              // آشغال بین فریم‌ها؛ نادیده
    case P_DIGITS:
        if (c >= '0' && c <= '9' && p->digits < 5U) {
            p->value = p->value * 10U + (unsigned)(c - '0');
            p->digits++;
        } else if (c == '\n' && p->digits > 0U) {
            p->state = P_WAIT_START;
            return R_OK;
        } else {
            p->state = P_WAIT_START;
            return R_BAD;
        }
        break;
    }
    return R_NONE;
}

int main(void)
{
    const char stream[] = "xx$12\n$7a\n$305\n$\n$1234567\n";
    parser_t p = { P_WAIT_START, 0, 0 };

    for (unsigned i = 0; stream[i] != '\0'; i++) {
        presult_t r = feed(&p, stream[i]);
        if (r == R_OK) {
            printf("frame ok: %u\n", p.value);
        } else if (r == R_BAD) {
            printf("bad frame at index %u\n", i);
        }
    }
    return 0;
}
