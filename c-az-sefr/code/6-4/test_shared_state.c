#include "minitest.h"
#include "ringbuf.h"

static ringbuf_t rb;

void setUp(void)
{
    rb_init(&rb);                       // درمان: هر تست بافر تازه می‌گیرد
}

void tearDown(void) {}

static void test_put_three_bytes(void)
{
    for (uint8_t i = 0; i < 3; i++) {
        TEST_ASSERT_TRUE(rb_put(&rb, i));
    }
    TEST_ASSERT_EQUAL_INT(3, rb_count(&rb));
}

static void test_new_buffer_is_empty(void)
{
    TEST_ASSERT_TRUE(rb_is_empty(&rb));
}

int main(void)
{
    TEST_BEGIN();
    RUN_TEST(test_put_three_bytes);
    RUN_TEST(test_new_buffer_is_empty);
    return TEST_END();
}
