#include "minitest.h"
#include "logger.h"

/* ماک UART: در هر فراخوانی حداکثر max_chunk بایت می‌پذیرد و همه را ضبط می‌کند */
typedef struct {
    uint8_t  sent[128];
    size_t   total;
    size_t   max_chunk;         /* سقف بایت در هر فراخوانی (شبیه FIFO پر) */
    unsigned calls;
    int      fail_on_call;      /* شمارهٔ فراخوانی‌ای که خطا بدهد؛ ۰ = هرگز */
} mock_tx_t;

static mock_tx_t uart;
static tx_ops_t  tx;

static int mock_write(void *ctx, const uint8_t *data, size_t n)
{
    mock_tx_t *m = ctx;
    m->calls++;
    if ((int)m->calls == m->fail_on_call) {
        return -1;
    }
    if (n > m->max_chunk) {
        n = m->max_chunk;
    }
    memcpy(&m->sent[m->total], data, n);
    m->total += n;
    return (int)n;
}

void setUp(void)
{
    memset(&uart, 0, sizeof(uart));
    uart.max_chunk = 100;
    tx.write = mock_write;
    tx.ctx = &uart;
}

void tearDown(void) {}

static void test_line_is_sent_with_crlf(void)
{
    TEST_ASSERT_EQUAL_INT(LOG_OK, log_line(&tx, "hello"));
    TEST_ASSERT_EQUAL_INT(7, uart.total);
    TEST_ASSERT_EQUAL_MEMORY("hello\r\n", uart.sent, 7);
    TEST_ASSERT_EQUAL_INT(1, uart.calls);
}

static void test_partial_writes_are_continued(void)
{
    uart.max_chunk = 2;                             // UART فقط دو بایت می‌پذیرد
    TEST_ASSERT_EQUAL_INT(LOG_OK, log_line(&tx, "hello"));
    TEST_ASSERT_EQUAL_MEMORY("hello\r\n", uart.sent, 7);
    TEST_ASSERT_EQUAL_INT(4, uart.calls);           // 2+2+2+1 بایت
}

static void test_zero_progress_is_an_io_error(void)
{
    uart.max_chunk = 0;                             // هیچ بایتی نمی‌پذیرد
    TEST_ASSERT_EQUAL_INT(LOG_ERR_IO, log_line(&tx, "hello"));
    TEST_ASSERT_EQUAL_INT(1, uart.calls);           // حلقه بی‌پایان نشد
}

static void test_error_in_the_middle_is_reported(void)
{
    uart.max_chunk = 3;
    uart.fail_on_call = 2;
    TEST_ASSERT_EQUAL_INT(LOG_ERR_IO, log_line(&tx, "hello"));
    TEST_ASSERT_EQUAL_INT(3, uart.total);           // فقط تکهٔ اول رفته
}

int main(void)
{
    TEST_BEGIN();
    RUN_TEST(test_line_is_sent_with_crlf);
    RUN_TEST(test_partial_writes_are_continued);
    RUN_TEST(test_zero_progress_is_an_io_error);
    RUN_TEST(test_error_in_the_middle_is_reported);
    return TEST_END();
}
