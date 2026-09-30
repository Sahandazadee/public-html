#include "minitest.h"
#include "ringbuf.h"

static ringbuf_t rb;

void setUp(void)
{
    rb_init(&rb);               // هر تست با یک بافر تازه شروع می‌کند
}

void tearDown(void) {}

/* کمکی: n بایت با مقدار first, first+1, ... می‌گذارد */
static void fill(uint8_t first, unsigned n)
{
    for (unsigned i = 0; i < n; i++) {
        TEST_ASSERT_TRUE(rb_put(&rb, (uint8_t)(first + i)));
    }
}

static void test_new_buffer_is_empty(void)
{
    TEST_ASSERT_TRUE(rb_is_empty(&rb));
    TEST_ASSERT_FALSE(rb_is_full(&rb));
    TEST_ASSERT_EQUAL_INT(0, rb_count(&rb));
}

static void test_bytes_come_out_in_same_order(void)
{
    uint8_t out = 0;
    fill(10, 3);
    TEST_ASSERT_EQUAL_INT(3, rb_count(&rb));
    TEST_ASSERT_TRUE(rb_get(&rb, &out));
    TEST_ASSERT_EQUAL_INT(10, out);
    TEST_ASSERT_TRUE(rb_get(&rb, &out));
    TEST_ASSERT_EQUAL_INT(11, out);
    TEST_ASSERT_TRUE(rb_get(&rb, &out));
    TEST_ASSERT_EQUAL_INT(12, out);
    TEST_ASSERT_TRUE(rb_is_empty(&rb));
}

static void test_full_buffer_rejects_new_byte(void)
{
    fill(0, RB_SIZE);
    TEST_ASSERT_TRUE(rb_is_full(&rb));
    TEST_ASSERT_FALSE(rb_put(&rb, 99));
    TEST_ASSERT_EQUAL_INT(RB_SIZE, rb_count(&rb));      // چیزی عوض نشد
}

static void test_get_on_empty_leaves_output_untouched(void)
{
    uint8_t out = 0x5A;
    TEST_ASSERT_FALSE(rb_get(&rb, &out));
    TEST_ASSERT_EQUAL_HEX(0x5A, out);
}

static void test_wraps_around_the_end_of_storage(void)
{
    uint8_t out = 0;
    fill(0, RB_SIZE);                       // پر
    for (unsigned i = 0; i < 3; i++) {      // سه‌تا خالی می‌کنیم
        TEST_ASSERT_TRUE(rb_get(&rb, &out));
    }
    fill(100, 3);                           // این سه‌تا از ابتدای آرایه شروع می‌شوند
    TEST_ASSERT_TRUE(rb_is_full(&rb));
    for (unsigned i = 3; i < RB_SIZE; i++) {
        TEST_ASSERT_TRUE(rb_get(&rb, &out));
        TEST_ASSERT_EQUAL_INT(i, out);
    }
    for (uint8_t v = 100; v < 103; v++) {
        TEST_ASSERT_TRUE(rb_get(&rb, &out));
        TEST_ASSERT_EQUAL_INT(v, out);
    }
    TEST_ASSERT_TRUE(rb_is_empty(&rb));
}

static void test_counters_survive_16_bit_wrap(void)
{
    uint8_t out = 0;
    for (uint32_t i = 0; i < 70000U; i++) { // بیش از ۶۵۵۳۶ عملیات
        TEST_ASSERT_TRUE(rb_put(&rb, (uint8_t)i));
        TEST_ASSERT_TRUE(rb_get(&rb, &out));
        TEST_ASSERT_EQUAL_INT((uint8_t)i, out);
    }
    TEST_ASSERT_TRUE(rb_is_empty(&rb));
    fill(1, RB_SIZE);                       // هنوز ظرفیت کامل دارد
    TEST_ASSERT_TRUE(rb_is_full(&rb));
}

int main(void)
{
    TEST_BEGIN();
    RUN_TEST(test_new_buffer_is_empty);
    RUN_TEST(test_bytes_come_out_in_same_order);
    RUN_TEST(test_full_buffer_rejects_new_byte);
    RUN_TEST(test_get_on_empty_leaves_output_untouched);
    RUN_TEST(test_wraps_around_the_end_of_storage);
    RUN_TEST(test_counters_survive_16_bit_wrap);
    return TEST_END();
}
