#include <stdio.h>
#include <string.h>
#include "logger.h"
#include "parser.h"
#include "ringbuf.h"
#include "temp.h"

static int checks;
static int failures;

#define CHECK(cond) do { \
    checks++; \
    if (!(cond)) { failures++; printf("FAIL %s:%d: %s\n", __FILE__, __LINE__, #cond); } \
} while (0)

/* ---------- HAL ساختگی: همه‌چیز را ضبط می‌کند و هیچ سخت‌افزاری لازم ندارد ---------- */
static char     uart_out[512];
static uint16_t next_raw;
static bool     led;
static uint32_t clock_ms;
static const char *input;

static bool     mock_sensor(uint16_t *raw)  { *raw = next_raw; return true; }
static void     mock_write(const char *s)   { strncat(uart_out, s, sizeof uart_out - strlen(uart_out) - 1u); }
static bool     mock_getc(char *c)          { if (*input == '\0') { return false; } *c = *input++; return true; }
static void     mock_led(bool on)           { led = on; }
static uint32_t mock_millis(void)           { return clock_ms; }

static const hal_t mock_hal = { mock_sensor, mock_write, mock_getc, mock_led, mock_millis };

static void reset_mock(void)
{
    uart_out[0] = '\0';
    led = false;
    clock_ms = 0u;
    input = "";
}

static uint16_t raw_for(int centi)      /* دلخواه‌ترین raw برای یک دمای هدف */
{
    for (uint16_t r = 0; r <= ADC_MAX; r++) {
        if (temp_from_raw(r) >= centi) {
            return r;
        }
    }
    return ADC_MAX;
}

static void test_temp(void)
{
    char buf[16];
    CHECK(temp_from_raw(0) == -4000);
    CHECK(temp_from_raw(ADC_MAX) == 12500);
    CHECK(temp_from_raw(60000u) == 12500);              /* عدد نامعتبر محدود می‌شود */
    (void)temp_format(buf, sizeof buf, 2345);
    CHECK(strcmp(buf, "23.45") == 0);
    (void)temp_format(buf, sizeof buf, -507);
    CHECK(strcmp(buf, "-5.07") == 0);
    (void)temp_format(buf, sizeof buf, 0);
    CHECK(strcmp(buf, "0.00") == 0);
    CHECK(temp_format(buf, 4, 12500) == 6u);            /* طول کامل، ولی کوتاه‌شده */
    CHECK(strcmp(buf, "125") == 0);
}

static void test_ring(void)
{
    ring_t r;
    sample_t s;
    ring_init(&r);
    CHECK(ring_count(&r) == 0u);
    CHECK(!ring_at(&r, 0u, &s));
    for (uint32_t i = 0; i < RING_CAPACITY; i++) {
        CHECK(!ring_push(&r, (sample_t){ i, (centi_t)i }));
    }
    CHECK(ring_count(&r) == RING_CAPACITY);
    CHECK(ring_push(&r, (sample_t){ 99u, 99 }));        /* پر بود: قدیمی‌ترین رفت */
    CHECK(ring_count(&r) == RING_CAPACITY);
    CHECK(ring_at(&r, 0u, &s) && s.t_ms == 1u);         /* صفر دور ریخته شد */
    CHECK(ring_at(&r, RING_CAPACITY - 1u, &s) && s.t_ms == 99u);
    CHECK(!ring_at(&r, RING_CAPACITY, &s));
}

static bool feed_line(const char *text, cmd_t *out)     /* true اگر خط کامل شد */
{
    parser_t p;
    parser_init(&p);
    for (const char *q = text; *q != '\0'; q++) {
        if (parser_feed(&p, *q, out)) {
            return true;
        }
    }
    return false;
}

static void test_parser(void)
{
    cmd_t c;
    CHECK(feed_line("START\n", &c) && c.kind == CMD_START);
    CHECK(feed_line("STOP\r", &c) && c.kind == CMD_STOP);
    CHECK(feed_line("STATUS\n", &c) && c.kind == CMD_STATUS);
    CHECK(feed_line("DUMP\n", &c) && c.kind == CMD_DUMP);
    CHECK(feed_line("SET HIGH 35\n", &c) && c.kind == CMD_SET_HIGH && c.arg == 35);
    CHECK(feed_line("SET HIGH -10\n", &c) && c.kind == CMD_SET_HIGH && c.arg == -10);
    CHECK(feed_line("SET HIGH 999\n", &c) && c.kind == CMD_ERROR);   /* خارج از محدودهٔ دما */
    CHECK(feed_line("SET HIGH abc\n", &c) && c.kind == CMD_ERROR);
    CHECK(feed_line("SET HIGH \n", &c) && c.kind == CMD_ERROR);
    CHECK(feed_line("start\n", &c) && c.kind == CMD_ERROR);          /* حروف کوچک نمی‌پذیریم */
    CHECK(feed_line("THIS IS WAY TOO LONG FOR THE LINE BUFFER\n", &c) && c.kind == CMD_ERROR);
    CHECK(!feed_line("STATUS", &c));                                 /* بدون newline کامل نمی‌شود */
}

static void run_ms(logger_t *lg, uint32_t ms)
{
    for (uint32_t i = 0; i < ms; i += 10u) {
        clock_ms += 10u;
        logger_poll(lg);
    }
}

static void test_fsm(void)
{
    logger_t lg;
    reset_mock();
    logger_init(&lg, &mock_hal);
    CHECK(lg.state == LG_IDLE);

    next_raw = raw_for(2000);
    run_ms(&lg, 3000u);
    CHECK(lg.total == 0u);                              /* IDLE: نمونه نمی‌گیرد */

    input = "START\n";
    run_ms(&lg, 100u);
    CHECK(lg.state == LG_SAMPLING);
    CHECK(lg.total == 1u);                              /* اولین نمونه بلافاصله */
    run_ms(&lg, 2000u);
    CHECK(lg.total == 3u);                              /* هر ۱۰۰۰ms یک نمونه */

    next_raw = raw_for(3100);                           /* بالای آستانهٔ 30.00 */
    run_ms(&lg, 1000u);
    CHECK(lg.state == LG_ALARM);
    CHECK(led);

    next_raw = raw_for(2900);                           /* زیر آستانه ولی هنوز در باند پسماند */
    run_ms(&lg, 1000u);
    CHECK(lg.state == LG_ALARM);
    CHECK(led);

    next_raw = raw_for(2700);                           /* کاملا پایین‌تر: آلارم تمام می‌شود */
    run_ms(&lg, 1000u);
    CHECK(lg.state == LG_SAMPLING);
    CHECK(!led);

    input = "STOP\n";
    run_ms(&lg, 100u);
    CHECK(lg.state == LG_IDLE);
    CHECK(strstr(uart_out, "-> ALARM") != NULL);
}

static void test_boundaries(void)                       /* مرزهای دقیق R1 و R4 */
{
    logger_t lg;
    reset_mock();
    logger_init(&lg, &mock_hal);
    input = "START\n";
    next_raw = 1000u;
    run_ms(&lg, 100u);
    CHECK(lg.state == LG_SAMPLING);

    /* آستانهٔ روشن شدن را دقیقا برابر دمای یک raw می‌گذاریم */
    uint16_t hot = 2000u;
    lg.high = temp_from_raw(hot);
    next_raw = (uint16_t)(hot - 1u);                    /* یک پله کمتر از آستانه */
    run_ms(&lg, 1000u);
    CHECK(lg.state == LG_SAMPLING);
    next_raw = hot;                                     /* دقیقا برابر آستانه: T >= high */
    run_ms(&lg, 1000u);
    CHECK(lg.state == LG_ALARM);

    /* آستانهٔ خاموش شدن (high - پسماند) را دقیقا برابر دمای یک raw می‌گذاریم */
    uint16_t cool = 1500u;
    lg.high = (centi_t)(temp_from_raw(cool) + ALARM_HYST_CENTI);
    next_raw = (uint16_t)(cool + 1u);                   /* یک پله بالاتر از مرز */
    run_ms(&lg, 1000u);
    CHECK(lg.state == LG_ALARM);
    next_raw = cool;                                    /* دقیقا روی مرز: T <= high - پسماند */
    run_ms(&lg, 1000u);
    CHECK(lg.state == LG_SAMPLING);
}

int main(void)
{
    test_temp();
    test_ring();
    test_parser();
    test_fsm();
    test_boundaries();
    if (failures != 0) {
        printf("%d of %d checks FAILED\n", failures, checks);
        return 1;
    }
    printf("all %d checks passed\n", checks);
    return 0;
}
