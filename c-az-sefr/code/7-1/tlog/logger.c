#include "logger.h"
#include "temp.h"

static void say(const logger_t *lg, const char *s)
{
    lg->hal->uart_write(s);
}

static void say_u32(const logger_t *lg, uint32_t v)
{
    char buf[12];
    (void)u32_to_dec(buf, sizeof buf, v);
    say(lg, buf);
}

static void say_temp(const logger_t *lg, centi_t t)
{
    char buf[16];
    (void)temp_format(buf, sizeof buf, t);
    say(lg, buf);
}

const char *logger_state_name(lg_state_t s)
{
    switch (s) {
    case LG_IDLE:     return "IDLE";
    case LG_SAMPLING: return "SAMPLING";
    case LG_ALARM:    return "ALARM";
    }
    return "?";
}

/* اعمال ورود به هر حالت یک‌جا جمع شده تا LED و پیام هیچ‌وقت ناهماهنگ نشوند */
static void enter_state(logger_t *lg, lg_state_t next)
{
    lg->state = next;
    lg->hal->led_set(next == LG_ALARM);
    switch (next) {
    case LG_IDLE:     say(lg, "-> IDLE\n");     break;
    case LG_SAMPLING: say(lg, "-> SAMPLING\n"); break;
    case LG_ALARM:    say(lg, "-> ALARM\n");    break;
    }
}

static void take_sample(logger_t *lg, uint32_t now)
{
    uint16_t raw;
    if (!lg->hal->sensor_read(&raw)) {
        say(lg, "ERR sensor\n");
        return;
    }
    sample_t s = { now, temp_from_raw(raw) };
    (void)ring_push(&lg->ring, s);
    lg->total++;

    say(lg, "t=");
    say_u32(lg, now);
    say(lg, " T=");
    say_temp(lg, s.centi);
    say(lg, "\n");

    if (lg->state == LG_SAMPLING && s.centi >= lg->high) {
        enter_state(lg, LG_ALARM);
    } else if (lg->state == LG_ALARM && s.centi <= lg->high - ALARM_HYST_CENTI) {
        enter_state(lg, LG_SAMPLING);   /* پسماند: پایین‌تر از آستانه باید بیاید */
    }
}

static void print_status(const logger_t *lg)
{
    say(lg, "STATE=");
    say(lg, logger_state_name(lg->state));
    say(lg, " samples=");
    say_u32(lg, lg->total);
    say(lg, " high=");
    say_temp(lg, lg->high);
    say(lg, "\n");
}

static void print_dump(const logger_t *lg)
{
    sample_t s;
    for (uint32_t i = 0; ring_at(&lg->ring, i, &s); i++) {
        say(lg, "  ");
        say_u32(lg, s.t_ms);
        say(lg, " ");
        say_temp(lg, s.centi);
        say(lg, "\n");
    }
}

static void handle_command(logger_t *lg, const cmd_t *c, uint32_t now)
{
    switch (c->kind) {
    case CMD_START:
        if (lg->state == LG_IDLE) {
            lg->last_sample_ms = now - SAMPLE_PERIOD_MS;   /* اولین نمونه همین حالا */
            enter_state(lg, LG_SAMPLING);
        }
        break;
    case CMD_STOP:
        if (lg->state != LG_IDLE) {
            enter_state(lg, LG_IDLE);
        }
        break;
    case CMD_STATUS:
        print_status(lg);
        break;
    case CMD_DUMP:
        print_dump(lg);
        break;
    case CMD_SET_HIGH:
        lg->high = (centi_t)(c->arg * 100);
        say(lg, "OK\n");
        break;
    case CMD_ERROR:
        say(lg, "ERR command\n");
        break;
    }
}

void logger_init(logger_t *lg, const hal_t *hal)
{
    lg->state = LG_IDLE;
    lg->hal = hal;
    parser_init(&lg->parser);
    ring_init(&lg->ring);
    lg->last_sample_ms = 0u;
    lg->total = 0u;
    lg->high = ALARM_HIGH_CENTI;
    hal->led_set(false);
}

void logger_poll(logger_t *lg)
{
    uint32_t now = lg->hal->millis();
    char ch;
    cmd_t cmd;

    while (lg->hal->uart_getc(&ch)) {
        if (parser_feed(&lg->parser, ch, &cmd)) {
            handle_command(lg, &cmd, now);
        }
    }
    if (lg->state != LG_IDLE && (uint32_t)(now - lg->last_sample_ms) >= SAMPLE_PERIOD_MS) {
        lg->last_sample_ms = now;
        take_sample(lg, now);
    }
}
