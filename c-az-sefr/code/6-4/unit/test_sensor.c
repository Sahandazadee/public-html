#include "minitest.h"
#include "sensor.h"
#include "hal.h"

/* ---- درگاه پیوندی (link seam): جایگزین hal_delay_ms واقعی ---- */
static uint32_t total_delay_ms;
void hal_delay_ms(uint32_t ms)
{
    total_delay_ms += ms;               // صبر واقعی نمی‌کنیم؛ فقط ثبت می‌کنیم
}

/* ---- ماکِ گذرگاه: جواب‌ها از یک سناریوی از پیش نوشته‌شده می‌آیند ---- */
#define MAX_CALLS 8U
typedef struct {
    int      result[MAX_CALLS];         /* هر فراخوانی چه کد برگرداند */
    uint8_t  value[MAX_CALLS];          /* و چه مقداری در *value بگذارد */
    unsigned calls;                     /* چند بار صدا زده شد */
    uint8_t  last_dev;                  /* آخرین آرگومان‌ها (جاسوس) */
    uint8_t  last_reg;
} mock_bus_t;

static mock_bus_t mock;
static bus_ops_t  bus;

static int mock_read_reg(void *ctx, uint8_t dev, uint8_t reg, uint8_t *value)
{
    mock_bus_t *m = ctx;
    if (m->calls >= MAX_CALLS) {
        TEST_FAIL_MESSAGE("unexpected extra bus call");
    }
    m->last_dev = dev;
    m->last_reg = reg;
    *value = m->value[m->calls];
    return m->result[m->calls++];
}

void setUp(void)
{
    memset(&mock, 0, sizeof(mock));
    bus.read_reg = mock_read_reg;
    bus.ctx = &mock;
    total_delay_ms = 0;
}

void tearDown(void) {}

static void test_correct_chip_id_gives_ok(void)
{
    mock.value[0] = 0x60;
    TEST_ASSERT_EQUAL_INT(SENSOR_OK, sensor_probe(&bus));
    TEST_ASSERT_EQUAL_INT(1, mock.calls);
    TEST_ASSERT_EQUAL_HEX(0x76, mock.last_dev);     // آدرس درست صدا زده شد؟
    TEST_ASSERT_EQUAL_HEX(0xD0, mock.last_reg);     // رجیستر درست خوانده شد؟
    TEST_ASSERT_EQUAL_INT(0, total_delay_ms);
}

static void test_wrong_chip_id_is_reported(void)
{
    mock.value[0] = 0x58;                           // شناسهٔ تراشهٔ دیگری
    TEST_ASSERT_EQUAL_INT(SENSOR_ERR_ID, sensor_probe(&bus));
    TEST_ASSERT_EQUAL_INT(1, mock.calls);           // برای شناسهٔ غلط تلاش مجدد نمی‌کنیم
}

static void test_retries_after_bus_errors(void)
{
    mock.result[0] = -1;
    mock.result[1] = -1;
    mock.value[2]  = 0x60;                          // بار سوم جواب می‌دهد
    TEST_ASSERT_EQUAL_INT(SENSOR_OK, sensor_probe(&bus));
    TEST_ASSERT_EQUAL_INT(3, mock.calls);
    TEST_ASSERT_EQUAL_INT(2 * SENSOR_RETRY_DELAY_MS, total_delay_ms);
}

static void test_gives_up_after_all_retries_fail(void)
{
    for (unsigned i = 0; i < MAX_CALLS; i++) {
        mock.result[i] = -1;
    }
    TEST_ASSERT_EQUAL_INT(SENSOR_ERR_BUS, sensor_probe(&bus));
    TEST_ASSERT_EQUAL_INT(SENSOR_RETRIES, mock.calls);
    TEST_ASSERT_EQUAL_INT(2 * SENSOR_RETRY_DELAY_MS, total_delay_ms);   // بعد از آخری صبر نمی‌کند
}

static void test_null_arguments_are_rejected(void)
{
    bus_ops_t empty = { NULL, NULL };
    TEST_ASSERT_EQUAL_INT(SENSOR_ERR_ARG, sensor_probe(NULL));
    TEST_ASSERT_EQUAL_INT(SENSOR_ERR_ARG, sensor_probe(&empty));
    TEST_ASSERT_EQUAL_INT(0, mock.calls);
}

int main(void)
{
    TEST_BEGIN();
    RUN_TEST(test_correct_chip_id_gives_ok);
    RUN_TEST(test_wrong_chip_id_is_reported);
    RUN_TEST(test_retries_after_bus_errors);
    RUN_TEST(test_gives_up_after_all_retries_fail);
    RUN_TEST(test_null_arguments_are_rejected);
    return TEST_END();
}
