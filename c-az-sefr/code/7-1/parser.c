#include "parser.h"

static bool str_eq(const char *a, const char *b)
{
    while (*a != '\0' && *a == *b) {
        a++;
        b++;
    }
    return *a == *b;
}

static bool starts_with(const char *s, const char *prefix, const char **rest)
{
    while (*prefix != '\0') {
        if (*s != *prefix) {
            return false;
        }
        s++;
        prefix++;
    }
    *rest = s;
    return true;
}

static bool parse_int(const char *s, int32_t *out)
{
    bool neg = false;
    int32_t v = 0;
    int digits = 0;

    if (*s == '-') {
        neg = true;
        s++;
    }
    for (; *s != '\0'; s++) {
        if (*s < '0' || *s > '9' || digits >= 4) {
            return false;               /* غیررقم یا خیلی بلند */
        }
        v = v * 10 + (*s - '0');
        digits++;
    }
    if (digits == 0) {
        return false;
    }
    *out = neg ? -v : v;
    return true;
}

static cmd_t parse_line(const char *line)
{
    cmd_t c = { CMD_ERROR, 0 };
    const char *rest = "";

    if (str_eq(line, "START")) {
        c.kind = CMD_START;
    } else if (str_eq(line, "STOP")) {
        c.kind = CMD_STOP;
    } else if (str_eq(line, "STATUS")) {
        c.kind = CMD_STATUS;
    } else if (str_eq(line, "DUMP")) {
        c.kind = CMD_DUMP;
    } else if (starts_with(line, "SET HIGH ", &rest) && parse_int(rest, &c.arg)) {
        if (c.arg >= -40 && c.arg <= 125) {
            c.kind = CMD_SET_HIGH;
        }
    }
    return c;
}

void parser_init(parser_t *p)
{
    p->len = 0u;
    p->overflow = false;
}

bool parser_feed(parser_t *p, char c, cmd_t *out)
{
    if (c == '\r' || c == '\n') {
        if (p->len == 0u && !p->overflow) {
            return false;               /* خط خالی (مثلا \r\n) نادیده گرفته می‌شود */
        }
        if (p->overflow) {
            out->kind = CMD_ERROR;
            out->arg = 0;
        } else {
            p->line[p->len] = '\0';
            *out = parse_line(p->line);
        }
        parser_init(p);
        return true;
    }
    if (p->len < CMD_LINE_MAX - 1u) {
        p->line[p->len++] = c;
    } else {
        p->overflow = true;
    }
    return false;
}
