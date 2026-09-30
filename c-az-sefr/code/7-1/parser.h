#ifndef PARSER_H
#define PARSER_H

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include "config.h"

typedef enum {
    CMD_START,
    CMD_STOP,
    CMD_STATUS,
    CMD_DUMP,
    CMD_SET_HIGH,                       /* arg = دما به درجهٔ کامل */
    CMD_ERROR
} cmd_kind_t;

typedef struct {
    cmd_kind_t kind;
    int32_t    arg;
} cmd_t;

typedef struct {
    char   line[CMD_LINE_MAX];
    size_t len;
    bool   overflow;                    /* خط از حد بلندتر شد */
} parser_t;

void parser_init(parser_t *p);
bool parser_feed(parser_t *p, char c, cmd_t *out);   /* true وقتی یک خط کامل فرمان شد */

#endif /* PARSER_H */
