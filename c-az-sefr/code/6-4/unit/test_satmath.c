#include "minitest.h"
#include "satmath.h"

void setUp(void) {}
void tearDown(void) {}

static void test_small_values_add_normally(void)
{
    TEST_ASSERT_EQUAL_INT(30, sat_add_u8(10, 20));
}

static void test_zero_is_neutral(void)
{
    TEST_ASSERT_EQUAL_INT(200, sat_add_u8(200, 0));
}

static void test_result_saturates_at_255(void)
{
    TEST_ASSERT_EQUAL_INT(255, sat_add_u8(200, 100));
}

static void test_exactly_255_is_not_clipped(void)
{
    TEST_ASSERT_EQUAL_INT(255, sat_add_u8(250, 5));
}

int main(void)
{
    TEST_BEGIN();
    RUN_TEST(test_small_values_add_normally);
    RUN_TEST(test_zero_is_neutral);
    RUN_TEST(test_result_saturates_at_255);
    RUN_TEST(test_exactly_255_is_not_clipped);
    return TEST_END();
}
